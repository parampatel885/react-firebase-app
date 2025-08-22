import React from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const HomePage = ({ onNavigate, user }) => {
  const navigate = useNavigate();

  const handleJoinClick = () => {
    if (!user) {
      navigate('/login', { state: { from: '/teams' } });
    } else {
      onNavigate('teams');
    }
  };

  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="logo-container">
          <h1 className="logo">PlayPal</h1>
          <div className="logo-subtitle">Connect Through Sports</div>
        </div>
        
        <div className="description">
          <h2>A platform where people can connect through sports</h2>
          <p>Join existing teams or create your own to find teammates, organize matches, and build lasting friendships through the power of sports.</p>
        </div>

        <div className="action-buttons">
          <div className="button-group">
            <button 
              className="btn btn-primary" 
              onClick={handleJoinClick}
            >
              Join Team
            </button>
            <p className="button-description">
              Browse existing teams and join the ones that match your interests and schedule
            </p>
          </div>

          <div className="button-group">
            <button 
              className="btn btn-secondary" 
              onClick={() => onNavigate('create')}
            >
              Create Team
            </button>
            <p className="button-description">
              Start your own team and invite others to join your sports community
            </p>
          </div>
        </div>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">🏃‍♂️</div>
            <h3>Find Teammates</h3>
            <p>Connect with players who share your passion for sports</p>
          </div>
          <div className="feature">
            <div className="feature-icon">⚽</div>
            <h3>Organize Matches</h3>
            <p>Create and join matches with ease</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🤝</div>
            <h3>Build Community</h3>
            <p>Form lasting friendships through sports</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage; 