import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getWeatherForecast, saveDate } from '../utils/api';
import { WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm } from 'react-icons/wi';
import { FaWind, FaTint, FaThermometerHalf, FaCloudRain, FaSave } from 'react-icons/fa';

const getWeatherIcon = (condition) => {
  if (condition.includes('rain')) return <WiRain size={40} />;
  if (condition.includes('cloud')) return <WiCloudy size={40} />;
  if (condition.includes('snow')) return <WiSnow size={40} />;
  if (condition.includes('thunder')) return <WiThunderstorm size={40} />;
  return <WiDaySunny size={40} />;
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [city, setCity] = useState('');
  const [forecasts, setForecasts] = useState([]);
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [note, setNote] = useState('');
  const [selectedForecast, setSelectedForecast] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await getWeatherForecast(city);
      // Get one forecast per day
      const dailyForecasts = res.data.forecasts.filter(f =>
        f.date.includes('12:00:00')
      ).slice(0, 7);
      setForecasts(dailyForecasts);
      setCityName(res.data.city);
    } catch (err) {
      setError('Could not fetch weather. Check the city name and try again.');
    }
    setLoading(false);
  };

  const handleSaveDate = async (forecast) => {
    setSelectedForecast(forecast);
  };

  const handleConfirmSave = async () => {
    if (!selectedForecast) return;
    try {
      await saveDate({
        date: selectedForecast.date,
        weatherCondition: selectedForecast.weatherCondition,
        temperature: selectedForecast.temperature,
        humidity: selectedForecast.humidity,
        windSpeed: selectedForecast.windSpeed,
        rainChance: selectedForecast.rainChance,
        note: note
      });
      setSuccess('Date saved successfully!');
      setSelectedForecast(null);
      setNote('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save date');
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>🌤️ Weather Dashboard</h2>
        <p>Welcome, {user?.name || 'Farmer'}! Search for weather in your area.</p>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name (e.g. Lagos, Abuja)"
          required
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search Weather'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {forecasts.length > 0 && (
        <div className="forecast-section">
          <h3>📍 7-Day Forecast for {cityName}</h3>
          <div className="forecast-grid">
            {forecasts.map((forecast, index) => (
              <div key={index} className="forecast-card">
                <div className="forecast-date">
                  {new Date(forecast.date).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric'
                  })}
                </div>
                <div className="forecast-icon">
                  {getWeatherIcon(forecast.weatherCondition)}
                </div>
                <div className="forecast-condition">
                  {forecast.weatherCondition}
                </div>
                <div className="forecast-details">
                  <span><FaThermometerHalf /> {Math.round(forecast.temperature)}°C</span>
                  <span><FaTint /> {forecast.humidity}%</span>
                  <span><FaWind /> {forecast.windSpeed} m/s</span>
                  <span><FaCloudRain /> {Math.round(forecast.rainChance)}%</span>
                </div>
                <button
                  className="btn-save"
                  onClick={() => handleSaveDate(forecast)}
                >
                  <FaSave /> Save Date
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedForecast && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Save This Date</h3>
            <p><strong>Date:</strong> {new Date(selectedForecast.date).toLocaleDateString()}</p>
            <p><strong>Condition:</strong> {selectedForecast.weatherCondition}</p>
            <p><strong>Temperature:</strong> {Math.round(selectedForecast.temperature)}°C</p>
            <div className="form-group">
              <label>Add a note (optional)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Good day for planting maize"
                rows={3}
              />
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={handleConfirmSave}>
                Confirm Save
              </button>
              <button className="btn-secondary" onClick={() => setSelectedForecast(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;