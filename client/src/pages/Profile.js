import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { FaMapMarkerAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Profile = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [location, setLocation] = useState({ city: '', country: '' });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLocationUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.put('/auth/update-location', location);
      setSuccess('Farm location updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update location');
    }
    setLoading(false);
  };

  return (
    <div className="profile-page">
      <div className="dashboard-header">
        <h2>👨‍🌾 Farmer Profile</h2>
        <p>Manage your account and farm location</p>
      </div>

      <div className="profile-grid">
        <div className="profile-card">
          <div className="profile-avatar">
            <FaUser size={60} />
          </div>
          <h3>{user?.name || 'Farmer'}</h3>
          <p className="profile-email">{user?.email || ''}</p>
          <button className="btn-logout" onClick={logoutUser}>
            <FaSignOutAlt /> Logout
          </button>
        </div>

        <div className="location-card">
          <h3><FaMapMarkerAlt /> Update Farm Location</h3>
          <p>Set your farm location to get accurate weather forecasts</p>

          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLocationUpdate}>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={location.city}
                onChange={(e) => setLocation({ ...location, city: e.target.value })}
                placeholder="e.g. Lagos, Kano, Ibadan"
                required
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                value={location.country}
                onChange={(e) => setLocation({ ...location, country: e.target.value })}
                placeholder="e.g. Nigeria"
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Location'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;