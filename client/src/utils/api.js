import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'https://farmer-weather-app.onrender.com/api'
});

// Add token to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// AUTH
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// WEATHER
export const getWeatherForecast = (city) => api.get(`/weather/forecast?city=${city}`);

// SAVED DATES
export const getSavedDates = () => api.get('/saved-dates');
export const saveDate = (data) => api.post('/saved-dates', data);
export const updateNote = (id, note) => api.put(`/saved-dates/${id}`, { note });
export const deleteDate = (id) => api.delete(`/saved-dates/${id}`);

export default api;