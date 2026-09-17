const db = require("../config/firebase");

// Automatically update actuators when blockage status changes
const updateActuatorsForBlockage = async (blockage) => {
    const actuatorStatus = blockage
        ? {
            pump1: false,
            pump2: false,
            servo1: 0,
            servo2: 0,
            redLED: true,
            yellowLED: false
        }
        : {
            pump1: true,
            pump2: false,
            servo1: 90,
            servo2: 0,
            redLED: false,
            yellowLED: true
        };

    await db.ref("actuators").set({
        ...actuatorStatus,
        timestamp: new Date().toISOString()
    });

    return actuatorStatus;
};


// Save sensor reading
const saveSensorReading = async (req, res) => {
    try {

        const {
            stage,
            waterDetected,
            pH,
            TDS,
            turbidity,
            DO,
            temperature,
            pump1,
            pump2,
            servo1,
            servo2,
            blockage
        } = req.body;


        // Check stage
        if (!stage) {
            return res.status(400).json({
                message: "Stage is required. Use 'before' or 'after'."
            });
        }


        // Check stage value
        if (stage !== "before" && stage !== "after") {
            return res.status(400).json({
                message: "Stage must be either 'before' or 'after'."
            });
        }


        // Determine system status
        let systemStatus = "NORMAL";

        if (blockage === true) {
            systemStatus = "BLOCKAGE_DETECTED";
        }


        // Automatically update actuators
        const actuatorStatus = await updateActuatorsForBlockage(
            blockage === true
        );


        // Create sensor reading
        const reading = {
            stage: stage,
            waterDetected: waterDetected ?? false,

            pH: pH ?? null,
            TDS: TDS ?? null,
            turbidity: turbidity ?? null,
            DO: DO ?? null,
            temperature: temperature ?? null,

            pump1: pump1 ?? false,
            pump2: pump2 ?? false,
            servo1: servo1 ?? 0,
            servo2: servo2 ?? 0,

            blockage: blockage ?? false,
            systemStatus: systemStatus,

            timestamp: new Date().toISOString()
        };


        // Save reading to Firebase
        const ref = db.ref(`sensorReadings/${stage}`);

        const newReading = await ref.push(reading);


        // Send response
        res.status(201).json({
            message: "Sensor reading saved successfully",
            id: newReading.key,
            data: reading,
            actuatorStatus: actuatorStatus
        });

    } catch (error) {

        console.error("Error saving sensor reading:", error);

        res.status(500).json({
            message: "Failed to save sensor reading",
            error: error.message
        });
    }
};


// Get sensor readings
const getSensorReadings = async (req, res) => {
    try {

        const snapshot = await db.ref("sensorReadings").once("value");

        const readings = snapshot.val();

        res.status(200).json({
            message: "Sensor readings retrieved successfully",
            data: readings || {}
        });

    } catch (error) {

        console.error("Error retrieving sensor readings:", error);

        res.status(500).json({
            message: "Failed to retrieve sensor readings",
            error: error.message
        });
    }
};


module.exports = {
    saveSensorReading,
    getSensorReadings
};