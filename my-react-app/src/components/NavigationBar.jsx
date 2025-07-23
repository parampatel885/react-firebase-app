import React from 'react';
import './NavigationBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase-config';

const NavigationBar = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigate('/');
  };

  const handleJoinClick = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: '/teams' } });
    } else {
      navigate('/teams');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-gradient">PlayPal</span>
      </Link>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><a href="/teams" onClick={handleJoinClick}>Join Team</a></li>
        <li><Link to="/create">Create Team</Link></li>
        {user && (
          <li>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default NavigationBar; 