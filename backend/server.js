const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize Express app
const app = express();
const port = 3001; // Define the port

// Middleware
app.use(cors()); // Allow Cross-Origin requests (from frontend)
app.use(bodyParser.json()); // Parse incoming JSON requests

// Pricing Model in Rupees (₹) (cute version)
const transportCosts = {
    'Car': 1000, // Base cost for Car in ₹
    'Bus': 400, // Base cost for Bus in ₹
    'MiniCab': 600, // Base cost for MiniCab in ₹
    'Auto': 200, // Base cost for Auto in ₹
    'Bicycle': 50, // Base cost for Bicycle in ₹
};

const placeCosts = {
    'Lalbagh Botanical Garden': 100,
    'Bangalore Palace': 150,
    'Vidhana Soudha': 50,
    'Mysore Palace': 200,
    'Chamundi Hill': 120,
    'Brindavan Gardens': 100,
    'Panambur Beach': 50,
    'Mangaladevi Temple': 70,
    'Kadri Manjunath Temple': 80,
};

// Function to calculate the journey cost in Rupees (₹) and add a cute touch
const calculateCost = (selectedPlaces, transportMode) => {
    let totalCost = 0;

    // Add cost of selected places
    selectedPlaces.forEach(place => {
        if (placeCosts[place]) {
            totalCost += placeCosts[place];
        }
    });

    // Add cost of selected transport mode
    if (transportCosts[transportMode]) {
        totalCost += transportCosts[transportMode];
    }

    return totalCost;
};

app.post('/submit-form', (req, res) => {
    const { searchQuery, selectedState, selectedCity, selectedPlaces, selectedTransport } = req.body;

    console.log('✨✨✨ We got your response! ✨✨✨');
    console.log('Received data:', req.body); // Logs the data received from the frontend

    // More fun logs to debug the flow
    console.log(`💬 Search Query: ${searchQuery}`);
    console.log(`🌟 Selected State: ${selectedState}`);
    console.log(`🌆 Selected City: ${selectedCity}`);
    console.log(`🗺️ Selected Places: ${selectedPlaces.join(", ")}`);
    console.log(`🚗 Selected Transport: ${selectedTransport}`);

    // Calculate the journey cost (in ₹)
    const journeyCost = calculateCost(selectedPlaces, selectedTransport);

    // Send the response back with a cute and playful message
    res.json({
        message: '🎉 YAY! Your response has been successfully submitted! 🎉',
        journeyCost: `💸 The estimated cost for your journey is ₹${journeyCost} ✨`,
        thankYouMessage: '🚀 You will be soon connected to a friendly service provider! Thank you so much for choosing us! 😊💖',
    });
});

// Start the server on port 3001
app.listen(port, () => {
    console.log(`🎈 Server is running on http://localhost:${port} 🎈`);
});