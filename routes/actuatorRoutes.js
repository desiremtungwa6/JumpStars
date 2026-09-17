const express = require("express");

const router = express.Router();

const {
    updateActuatorStatus,
    getActuatorStatus
} = require("../controllers/actuatorController");

// Update actuator status
router.post("/status", updateActuatorStatus);

// Get actuator status
router.get("/status", getActuatorStatus);

module.exports = router;