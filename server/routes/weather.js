const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

// GET WEATHER FORECAST
router.get('/forecast', auth, async (req, res) => {
  const { city } = req.query;

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.WEATHER_API_KEY}`
    );

    const forecasts = response.data.list.map(item => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      rainChance: item.pop * 100,
      weatherCondition: item.weather[0].description,
      icon: item.weather[0].icon
    }));

    res.json({ forecasts, city: response.data.city.name });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});

module.exports = router;