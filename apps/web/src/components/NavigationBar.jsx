import React, { useState } from 'react';
import './NavigationBar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavigationBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const handleJoinClick = () => {
    setMenuOpen(false);
    if (!user) {
      navigate('/login', { state: { from: '/teams' } });
    } else {
      navigate('/teams');
    }
  };

  const closeMenu = () => setMenuOpen(false);
  const isActive = (path) => location.pathname === path;

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?';

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" onClick={closeMenu}>
          <span className="navbar__logo-icon">⚡</span>
          PlayPal
        </Link>

        <button
          className="navbar__toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`navbar__toggle-bar ${menuOpen ? 'open' : ''}`} />
          <span className={`navbar__toggle-bar ${menuOpen ? 'open' : ''}`} />
          <span className={`navbar__toggle-bar ${menuOpen ? 'open' : ''}`} />
        </button>

        <nav className={`navbar__nav ${menuOpen ? 'navbar__nav--open' : ''}`}>
          <Link
            to="/"
            className={`navbar__link ${isActive('/') ? 'navbar__link--active' : ''}`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <button
            className={`navbar__link ${isActive('/teams') ? 'navbar__link--active' : ''}`}
            onClick={handleJoinClick}
          >
            Browse Teams
          </button>
          {user && (
            <>
              <Link
                to="/my-teams"
                className={`navbar__link ${isActive('/my-teams') ? 'navbar__link--active' : ''}`}
                onClick={closeMenu}
              >
                My Teams
              </Link>
              <Link
                to="/member-teams"
                className={`navbar__link ${isActive('/member-teams') ? 'navbar__link--active' : ''}`}
                onClick={closeMenu}
              >
                Joined Teams
              </Link>
            </>
          )}
          <Link
            to="/create"
            className={`navbar__link ${isActive('/create') ? 'navbar__link--active' : ''}`}
            onClick={closeMenu}
          >
            Create Team
          </Link>

          {user ? (
            <div className="navbar__user">
              <Link
                to="/account"
                className="navbar__avatar"
                title={user.displayName || user.email}
                onClick={closeMenu}
              >
                {initials}
              </Link>
              <Link
                to="/account"
                className={`navbar__link ${isActive('/account') ? 'navbar__link--active' : ''}`}
                onClick={closeMenu}
              >
                Account
              </Link>
              <button className="btn btn--ghost btn--sm navbar__logout" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn--primary btn--sm navbar__signin"
              onClick={closeMenu}
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavigationBar;
