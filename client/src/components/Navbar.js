import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaCalendarAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">🌾 FarmWeather</Link>
      </div>

      {user && (
        <div className="navbar-links">
          <Link to="/dashboard" className={isActive('/dashboard')}>
            <FaHome /> Dashboard
          </Link>
          <Link to="/calendar" className={isActive('/calendar')}>
            <FaCalendarAlt /> Saved Dates
          </Link>
          <Link to="/profile" className={isActive('/profile')}>
            <FaUser /> Profile
          </Link>
          <button className="nav-logout" onClick={logoutUser}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;