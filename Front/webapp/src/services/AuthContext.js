import React, { createContext, useState, useEffect } from 'react';
import axios from './axios';  // Make sure this is set to the correct Axios instance
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);  // to prevent UI from showing while authentication state is being checked
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    console.log('Token from Cookies:', token); // Debugging line to verify token
    const storedUser = localStorage.getItem('user'); // Retrieve user data from localStorage
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the user data from localStorage
    }
    setLoading(false);
  }, []);

  // Login function to authenticate the user
  const login = async (userName, password) => {
    try {
      const response = await axios.post('/api/login', { userName, password });
      const { accessToken } = response.data;

      // Store the access token in cookies and user data in localStorage
      Cookies.set('accessToken', accessToken, { expires: 1 });
      setAccessToken(accessToken);
      
      const userData = { name: userName };  // Store userName
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); // Persist user data in localStorage

      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login failed', error);
      setIsAuthenticated(false);
    }
  };

  // Function to refresh the access token using the refresh token
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('/api/accessToken', {}, { withCredentials: true });
      const { accessToken } = response.data;

      // Update the access token
      Cookies.set('accessToken', accessToken, { expires: 1 });
      setAccessToken(accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token refresh failed', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false); // Ensure loading is stopped once the process is complete
    }
  };

  // Logout function to invalidate the session
  const logout = async () => {
    try {
      // Optionally, check if RefreshToken exists before attempting to logout on the server
      const refreshToken = Cookies.get('RefreshToken');
      if (!refreshToken) {
        console.error('No RefreshToken found. User may already be logged out.');
      }
  
      // Attempt to send the logout request to the backend
      await axios.post('/api/logout', {}, { withCredentials: true });
  
    } catch (error) {
      // Log any errors during the logout request to the backend
      console.error('Logout request failed. But proceeding with client-side logout.', error);
    } finally {
      // Regardless of the backend response (success or failure), remove the cookies and update state
      Cookies.remove('accessToken');
      Cookies.remove('RefreshToken');
      setAccessToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      
      // Optionally, you can redirect the user to a login page after logout
      // window.location.href = '/login';  // Uncomment if you want to redirect
    }
  };

  // If the app is still loading (waiting for auth state), show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated, user, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
