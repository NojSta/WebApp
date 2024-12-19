import React, { createContext, useState, useEffect } from 'react';
import axios from './axios';  // Make sure this is set to the correct Axios instance
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookies.get('accessToken');
    const storedUser = localStorage.getItem('user');
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function to authenticate the user
  const login = async (userName, password) => {
    try {
      const response = await axios.post('/api/login', { userName, password });
      const { accessToken } = response.data;
  
      // Store access token in cookies and user data in localStorage
      Cookies.set('accessToken', accessToken, { expires: 1 });
      setAccessToken(accessToken);
      
      const userData = { name: userName };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
  
      setIsAuthenticated(true);
      
      return true;  // Return true to indicate login success
    } catch (error) {
      console.error('Login failed', error);
      setIsAuthenticated(false);
      return false;  // Return false to indicate login failure
    }
  };
  

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('/api/accessToken', {}, { withCredentials: true });
      const { accessToken } = response.data;

      Cookies.set('accessToken', accessToken, { expires: 1 });
      setAccessToken(accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token refresh failed', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = Cookies.get('RefreshToken');
      if (!refreshToken) {
        console.error('No RefreshToken found. User may already be logged out.');
      }
      await axios.post('/api/logout', {}, { withCredentials: true });
  
    } catch (error) {
      console.error('Logout request failed. But proceeding with client-side logout.', error);
    } finally {

      Cookies.remove('accessToken');
      Cookies.remove('RefreshToken');
      setAccessToken(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      
    }
  };

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
