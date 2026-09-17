const express = require("express");

const router = express.Router();

const {
    saveSensorReading,
    getSensorReadings
} = require("../controllers/sensorController");

// Save a sensor reading
router.post("/readings", saveSensorReading);

// Get all sensor readings
router.get("/readings", getSensorReadings);

module.exports = router;