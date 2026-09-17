const db = require("../config/firebase");

const updateActuatorStatus = async (req, res) => {
    try {
        const {
            pump1,
            pump2,
            servo1,
            servo2,
            redLED,
            yellowLED
        } = req.body;

        const actuatorStatus = {
            pump1: pump1 ?? false,
            pump2: pump2 ?? false,
            servo1: servo1 ?? 0,
            servo2: servo2 ?? 0,
            redLED: redLED ?? false,
            yellowLED: yellowLED ?? false,
            timestamp: new Date().toISOString()
        };

        await db.ref("actuators").set(actuatorStatus);

        res.status(200).json({
            message: "Actuator status updated successfully",
            data: actuatorStatus
        });

    } catch (error) {
        console.error("Error updating actuator status:", error);

        res.status(500).json({
            message: "Failed to update actuator status",
            error: error.message
        });
    }
};

const getActuatorStatus = async (req, res) => {
    try {
        const snapshot = await db.ref("actuators").once("value");

        const actuatorStatus = snapshot.val();

        res.status(200).json({
            message: "Actuator status retrieved successfully",
            data: actuatorStatus || {}
        });

    } catch (error) {
        console.error("Error retrieving actuator status:", error);

        res.status(500).json({
            message: "Failed to retrieve actuator status",
            error: error.message
        });
    }
};

module.exports = {
    updateActuatorStatus,
    getActuatorStatus
};