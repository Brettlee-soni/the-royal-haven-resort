const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const mongoose = require('mongoose');
// 1. Get All Rooms (सारे रूम्स देखने के लिए)
router.get('/', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Add a New Room (नया रूम जोड़ने के लिए)
router.post('/add', async (req, res) => {
  const { name, type, price, description, image } = req.body;
  try {
    const newRoom = new Room({ name, type, price, description, image });
    await newRoom.save();
    res.status(201).json({ message: 'Room Added Successfully!', room: newRoom });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Test Route: Dummy Room Add करने के लिए
router.get('/', async (req, res) => {
  console.log("ROOM API DB STATE:", mongoose.connection.readyState);
  console.log("ROOM API DB NAME:", mongoose.connection.name);

  try {
    const rooms = await Room.find();
    console.log("ROOMS FETCHED:", rooms.length);
    res.status(200).json(rooms);
  } catch (error) {
    console.error("ROOM FETCH ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;