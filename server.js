// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define a schema for the logs
const logSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now }, // Automatically set timestamp
    batteryLevel: { type: Number, required: true }, // Battery level is required
    batteryState: { type: String }, // Charging, Discharging, etc.
    reason: { type: String, required: true }, // Reason is required
    phoneModel: { type: String }, // Phone model
    deviceId: { type: String }, // Unique device ID
    osVersion: { type: String }, // Operating system version
    appVersion: { type: String }, // Your app's version
}, {collection: 'rework_settings_logs_2_hours_test'});

// Create a model from the schema
const Log = mongoose.model('Log', logSchema);

// Endpoint to receive logs
app.post('/log', async (req, res) => {
    const {timestamp ,
        batteryLevel,
        batteryState,
        reason,
        phoneModel,
        deviceId ,
        osVersion,
        appVersion,} = req.body;

    // Validate the input
    if (batteryLevel === undefined || reason === undefined) {
        return res.status(400).send('Missing batteryLevel or reason in request body.');
    }

    const logEntry = new Log({
        timestamp ,
        batteryLevel,
        batteryState,
        reason,
        phoneModel,
        deviceId ,
        osVersion,
        appVersion,
    });

    try {
        await logEntry.save();
        console.log('Log entry saved:', logEntry);
        res.status(200).send('Log saved successfully.');
    } catch (error) {
        console.error('Error saving to MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Log server listening at http://localhost:${port}`);
});
