import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Destinations from './components/Destinations/Destinations';
import Reviews from './components/Reviews/Reviews';
import Comments from './components/Comments/Comments';
import LoginForm from './components/User/LoginForm';
import RegisterForm from './components/User/RegisterForm';
import { AuthProvider, useAuth } from './services/AuthContext';  // Import AuthContext and useAuth
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toolbar />
        <Routes>
          <Route path="/" element={<Destinations />} />
          <Route path="/destinations/:destinationId" element={<Reviews Comments/>} />
          <Route path="/destinations/:destinationId/reviews/:reviewId" element={<Comments />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

const Toolbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="toolbar">
      <Link to="/" className="nav-button">Home</Link>
      {isAuthenticated ? (
        <>
          <span>Welcome, {user ? user.name : 'Userr'}</span>  {/* Display user's name here */}
          <button onClick={logout} className="nav-button">Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" className="nav-button">Login</Link>
          <Link to="/register" className="nav-button">Register</Link>
        </>
      )}
    </div>
  );
};

export default App;
