const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Security middleware
const morgan = require('morgan'); // Request logging

const app = express();
const PORT = process.env.PORT || 3001;


// --- CONFIGURATION & DATA ---
// Move business logic data to constants
const PRICING_DATA = {
    TRANSPORT: {
        'Car': 1000,
        'Bus': 400,
        'MiniCab': 600,
        'Auto': 200,
        'Bicycle': 50,
    },
    ENTRANCE_FEES: {
        'Lalbagh Botanical Garden': 100,
        'Bangalore Palace': 150,
        'Vidhana Soudha': 50,
        'Mysore Palace': 200,
        'Chamundi Hill': 120,
        'Brindavan Gardens': 100,
        'Panambur Beach': 50,
        'Mangaladevi Temple': 70,
        'Kadri Manjunath Temple': 80,
    }
};

// --- MIDDLEWARE ---
app.use(helmet()); // Protects against common web vulnerabilities
app.use(cors({ origin: 'http://localhost:3000' })); // Restrict to your frontend URL
app.use(express.json()); // Built-in alternative to body-parser
app.use(morgan('dev')); // Professional logging of every request

// --- UTILITY FUNCTIONS ---
/**
 * Calculates total itinerary cost based on validated inputs
 */
const calculateItineraryCost = (places = [], transport = '') => {
    const placesTotal = places.reduce((sum, place) => {
        return sum + (PRICING_DATA.ENTRANCE_FEES[place] || 0);
    }, 0);

    const transportFee = PRICING_DATA.TRANSPORT[transport] || 0;
    return placesTotal + transportFee;
};

// --- ROUTES ---

/**
 * @route   POST /submit-form
 * @desc    Processes travel selections and returns financial estimate
 * @access  Public
 */
app.post('/submit-form', (req, res) => {
    const { selectedState, selectedCity, selectedPlaces, selectedTransport } = req.body;

    // 1. Basic Validation
    if (!selectedState || !selectedCity || !selectedTransport) {
        return res.status(400).json({
            success: false,
            message: 'Invalid Request: Missing required itinerary parameters.'
        });
    }

    // 2. Business Logic Execution
    try {
        const totalEstimate = calculateItineraryCost(selectedPlaces, selectedTransport);

        // 3. Structured Response
        return res.status(200).json({
            success: true,
            message: 'Itinerary processed successfully.',
            journeyCost: `Estimated Total: ₹${totalEstimate.toLocaleString('en-IN')}`,
            data: {
                baseCurrency: 'INR',
                totalAmount: totalEstimate,
                referenceId: `PMJ-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
            },
            thankYouMessage: 'A service coordinator will review your itinerary and contact you shortly.'
        });

    } catch (error) {
        console.error('Processing Error:', error);
        return res.status(500).json({
            success: false,
            message: 'An internal error occurred while calculating your itinerary.'
        });
    }
});

// --- SERVER INITIALIZATION ---
app.listen(PORT, () => {
    console.log(`
    =========================================
    🚀 TRAVEL API GATEWAY ACTIVE
    📡 PORT: ${PORT}
    🌐 MODE: DEVELOPMENT
    =========================================
    `);
});