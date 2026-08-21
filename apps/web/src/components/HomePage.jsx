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

  const features = [
    {
      icon: '🏃',
      title: 'Find Teammates',
      description: 'Match with players who share your sport, skill level, and schedule.',
    },
    {
      icon: '📅',
      title: 'Organize Matches',
      description: 'Coordinate games, practices, and events with your team in one place.',
    },
    {
      icon: '🤝',
      title: 'Build Community',
      description: 'Grow lasting friendships through the sports you love.',
    },
  ];

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero__content">
          <span className="hero__badge">Connect Through Sports</span>
          <h1 className="hero__title">
            Find your team.<br />
            <span className="hero__title-accent">Play together.</span>
          </h1>
          <p className="hero__subtitle">
            Join existing teams or start your own. PlayPal makes it easy to find
            teammates, organize matches, and build your sports community.
          </p>

          <div className="hero__actions">
            <button className="btn btn--primary btn--lg" onClick={handleJoinClick}>
              Browse Teams
            </button>
            <button className="btn btn--secondary btn--lg" onClick={() => onNavigate('create')}>
              Create a Team
            </button>
          </div>

          <div className="hero__stats">
            <div className="hero__stat">
              <strong>15+</strong>
              <span>Sports supported</span>
            </div>
            <div className="hero__stat">
              <strong>Free</strong>
              <span>To join & create</span>
            </div>
            <div className="hero__stat">
              <strong>Local</strong>
              <span>Teams near you</span>
            </div>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__card hero__card--1">
            <span>⚽</span>
            <div>
              <strong>Sunday Soccer</strong>
              <small>Central Park · 8/12 spots</small>
            </div>
          </div>
          <div className="hero__card hero__card--2">
            <span>🏀</span>
            <div>
              <strong>Hoopers United</strong>
              <small>Downtown Gym · Open</small>
            </div>
          </div>
          <div className="hero__card hero__card--3">
            <span>🎾</span>
            <div>
              <strong>Tennis Club</strong>
              <small>Riverside · 4/6 spots</small>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features__inner">
          <h2 className="features__heading">Everything you need to play</h2>
          <div className="features__grid">
            {features.map((feature) => (
              <article key={feature.title} className="features__card">
                <div className="features__icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-banner__inner">
          <div>
            <h2>Ready to get in the game?</h2>
            <p>Create your team in minutes and start inviting players today.</p>
          </div>
          <button className="btn btn--accent btn--lg" onClick={() => onNavigate('create')}>
            Get Started
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
