const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const SavedDate = require('../models/SavedDate');

// GET ALL SAVED DATES FOR A USER
router.get('/', auth, async (req, res) => {
  try {
    const savedDates = await SavedDate.find({ user: req.user.id })
      .sort({ date: 1 });
    res.json(savedDates);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// SAVE A NEW DATE
router.post('/', auth, async (req, res) => {
  const { date, weatherCondition, temperature, humidity, windSpeed, rainChance, note } = req.body;

  try {
    const newSavedDate = new SavedDate({
      user: req.user.id,
      date,
      weatherCondition,
      temperature,
      humidity,
      windSpeed,
      rainChance,
      note
    });

    const savedDate = await newSavedDate.save();
    res.json(savedDate);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE NOTE ON A SAVED DATE
router.put('/:id', auth, async (req, res) => {
  const { note } = req.body;

  try {
    let savedDate = await SavedDate.findById(req.params.id);
    if (!savedDate) {
      return res.status(404).json({ message: 'Saved date not found' });
    }

    // Make sure user owns the saved date
    if (savedDate.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    savedDate.note = note;
    await savedDate.save();
    res.json(savedDate);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE A SAVED DATE
router.delete('/:id', auth, async (req, res) => {
  try {
    let savedDate = await SavedDate.findById(req.params.id);
    if (!savedDate) {
      return res.status(404).json({ message: 'Saved date not found' });
    }

    // Make sure user owns the saved date
    if (savedDate.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await SavedDate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Saved date removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
