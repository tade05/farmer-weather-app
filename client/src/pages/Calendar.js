import React, { useState, useEffect } from 'react';
import { getSavedDates, updateNote, deleteDate } from '../utils/api';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { WiDaySunny, WiRain, WiCloudy, WiSnow, WiThunderstorm } from 'react-icons/wi';

const getWeatherIcon = (condition) => {
  if (condition.includes('rain')) return <WiRain size={30} />;
  if (condition.includes('cloud')) return <WiCloudy size={30} />;
  if (condition.includes('snow')) return <WiSnow size={30} />;
  if (condition.includes('thunder')) return <WiThunderstorm size={30} />;
  return <WiDaySunny size={30} />;
};

const Calendar = () => {
  const [savedDates, setSavedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState('');

  useEffect(() => {
    fetchSavedDates();
  }, []);

  const fetchSavedDates = async () => {
    try {
      const res = await getSavedDates();
      setSavedDates(res.data);
    } catch (err) {
      setError('Failed to load saved dates');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this date?')) return;
    try {
      await deleteDate(id);
      setSavedDates(savedDates.filter(date => date._id !== id));
    } catch (err) {
      setError('Failed to delete date');
    }
  };

  const handleEditStart = (date) => {
    setEditingId(date._id);
    setEditNote(date.note);
  };

  const handleEditSave = async (id) => {
    try {
      await updateNote(id, editNote);
      setSavedDates(savedDates.map(date =>
        date._id === id ? { ...date, note: editNote } : date
      ));
      setEditingId(null);
    } catch (err) {
      setError('Failed to update note');
    }
  };

  if (loading) return <div className="loading">Loading saved dates...</div>;

  return (
    <div className="calendar-page">
      <div className="dashboard-header">
        <h2>📅 Saved Favorable Dates</h2>
        <p>All your saved weather dates in one place</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {savedDates.length === 0 ? (
        <div className="empty-state">
          <p>🌱 No saved dates yet!</p>
          <p>Go to the Dashboard to search for weather and save favorable dates.</p>
        </div>
      ) : (
        <div className="saved-dates-grid">
          {savedDates.map((date) => (
            <div key={date._id} className="saved-date-card">
              <div className="saved-date-header">
                <div className="saved-date-icon">
                  {getWeatherIcon(date.weatherCondition)}
                </div>
                <div className="saved-date-info">
                  <h3>{new Date(date.date).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric',
                    month: 'long', day: 'numeric'
                  })}</h3>
                  <p className="weather-condition">{date.weatherCondition}</p>
                </div>
              </div>

              <div className="saved-date-details">
                <span>🌡️ {Math.round(date.temperature)}°C</span>
                <span>💧 {date.humidity}%</span>
                <span>💨 {date.windSpeed} m/s</span>
                <span>🌧️ {Math.round(date.rainChance)}%</span>
              </div>

              <div className="saved-date-note">
                {editingId === date._id ? (
                  <div className="edit-note">
                    <textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      rows={2}
                    />
                    <div className="edit-buttons">
                      <button className="btn-icon success" onClick={() => handleEditSave(date._id)}>
                        <FaCheck />
                      </button>
                      <button className="btn-icon danger" onClick={() => setEditingId(null)}>
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="note-display">
                    <p>{date.note || 'No note added'}</p>
                  </div>
                )}
              </div>

              <div className="saved-date-actions">
                <button className="btn-icon edit" onClick={() => handleEditStart(date)}>
                  <FaEdit /> Edit Note
                </button>
                <button className="btn-icon danger" onClick={() => handleDelete(date._id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calendar;