import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/api';
import { FaMapMarkerAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Profile = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [location, setLocation] = useState({
    city: user?.farmLocation?.city || '',
    country: user?.farmLocation?.country || ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // City suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const debounceRef = useRef(null);
  const suggestionsRef = useRef(null);

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSuggestionsLoading(true);
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`
      );
      const data = await res.json();
      if (data.results) {
        setSuggestions(data.results.map(r => ({
          name: r.name,
          country: r.country,
          admin1: r.admin1,
        })));
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch {
      setSuggestions([]);
    }
    setSuggestionsLoading(false);
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    setLocation({ ...location, city: value });
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
  };

  const handleSelectSuggestion = (suggestion) => {
    setLocation({
      city: suggestion.name,
      country: suggestion.country || location.country
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Fixed: matches backend route /update-location expecting { city, country }
      await api.put('/auth/update-location', {
        city: location.city,
        country: location.country
      });
      setSuccess('Farm location updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to update location. Please try again.'
      );
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
              <div className="profile-input-wrapper" ref={suggestionsRef}>
                <input
                  type="text"
                  value={location.city}
                  onChange={handleCityChange}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="e.g. Lagos, Kano, Ibadan"
                  required
                  autoComplete="off"
                />
                {showSuggestions && (
                  <ul className="suggestions-list">
                    {suggestionsLoading && (
                      <li className="suggestions-loading">Searching...</li>
                    )}
                    {!suggestionsLoading && suggestions.map((s, i) => (
                      <li
                        key={i}
                        className="suggestion-item"
                        onMouseDown={() => handleSelectSuggestion(s)}
                      >
                        <span className="suggestion-city">{s.name}</span>
                        {s.admin1 || s.country ? (
                          <span className="suggestion-region">
                            {[s.admin1, s.country].filter(Boolean).join(', ')}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
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