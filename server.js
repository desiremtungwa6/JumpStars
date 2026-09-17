const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

// Sensor routes
const sensorRoutes = require("./routes/sensorRoutes");

app.use("/api/sensors", sensorRoutes);

const actuatorRoutes = require("./routes/actuatorRoutes");

app.use("/api/actuators", actuatorRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "AMD Monitoring System Backend is running!"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});