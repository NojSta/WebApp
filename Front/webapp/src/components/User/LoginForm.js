import React, { useState } from 'react';
import { useAuth } from '../../services/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { login } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook to navigate to different pages

  const handleLogin = async (e) => {
    e.preventDefault();

    const success = await login(userName, password); // Await login result

    if (success) {
      // Redirect to the main page or home page after successful login
      navigate('/'); // Change '/' to your desired main page route
    } else {
      // Handle login failure
      alert('Login failed, please check your credentials and try again.');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
