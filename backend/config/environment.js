const path = require('path');

// Load environment variables from .env file if it exists
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const config = {
    // Server configuration
    PORT: process.env.PORT || 3100,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Firebase configuration
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_SERVICE_ACCOUNT: process.env.FIREBASE_SERVICE_ACCOUNT,
    FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
    FIRESTORE_EMULATOR_HOST: process.env.FIRESTORE_EMULATOR_HOST,
    
    // Feature flags
    USE_REAL_FIRESTORE: process.env.USE_REAL_FIRESTORE === 'true' || process.env.NODE_ENV === 'production',
    USE_MOCK_LLM: process.env.USE_MOCK_LLM === 'true',
    
    // LLM configuration
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    
    // Frontend configuration
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};

// Validation
if (config.USE_REAL_FIRESTORE && !config.FIREBASE_PROJECT_ID) {
    console.warn('Warning: USE_REAL_FIRESTORE is true but FIREBASE_PROJECT_ID is not set');
}

if (!config.USE_MOCK_LLM && !config.GEMINI_API_KEY) {
    console.warn('Warning: GEMINI_API_KEY is not set, LLM features may not work');
}

module.exports = config;