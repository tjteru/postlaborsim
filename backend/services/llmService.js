const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/environment');

const apiKey = config.GEMINI_API_KEY || '';
let useMock = config.USE_MOCK_LLM || !apiKey;

let genAI, model;
if (!useMock && apiKey) {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Updated model name
        console.log('Using real Gemini AI service');
    } catch (error) {
        console.warn('Failed to initialize Gemini AI, falling back to mock mode:', error.message);
        useMock = true;
    }
} else {
    console.log('Using mock LLM service (no API key provided)');
}

async function callModel(prompt) {
    if (useMock) {
        // Return mock responses based on prompt keywords
        if (prompt.includes('interconnected businesses')) {
            return JSON.stringify([
                { name: "TechFlow Solutions", type: "software" },
                { name: "GreenLeaf Farms", type: "agriculture" },
                { name: "Urban Logistics", type: "transportation" }
            ]);
        } else if (prompt.includes('detailed profile')) {
            return JSON.stringify({
                name: "Mock Company",
                cash: 50000,
                revenue: 25000,
                employees: [
                    { name: "Alex Chen", role: "Developer", salary: 75000 },
                    { name: "Sam Rivera", role: "Designer", salary: 65000 }
                ],
                backstory: "A growing technology company focused on automation solutions."
            });
        } else if (prompt.includes('AI-driven opportunity')) {
            return JSON.stringify({
                title: "Process Automation",
                description: "Implement AI-powered workflow automation to reduce manual tasks by 30%."
            });
        } else if (prompt.includes('news update')) {
            return "Economic activity continues with steady growth across key sectors. Companies are adapting to new market conditions.";
        }
        return "Mock response";
    }
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}

function extractJSON(text) {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (match) {
        try {
            return JSON.parse(match[0]);
        } catch (err) {
            return null;
        }
    }
    return null;
}

async function generateEcosystem(playerCount) {
    const prompt = `Generate a JSON array of ${playerCount} interconnected businesses. Include a simple name and type for each business.`;
    const text = await callModel(prompt);
    return extractJSON(text) || [];
}

async function generateCompanyDetails(businessType) {
    const prompt = `Create a detailed profile in JSON for a ${businessType} business. Include backstory, financials, objectives and a small employee roster.`;
    const text = await callModel(prompt);
    return extractJSON(text) || {};
}

async function generateAIOpportunity(business) {
    const prompt = `Given this business profile: ${JSON.stringify(business)}, suggest one AI-driven opportunity in JSON with a title and description.`;
    const text = await callModel(prompt);
    return extractJSON(text) || {};
}

async function generateNewsUpdate(previousState, newState) {
    const prompt = `Write a short news update summarizing the economic changes from ${JSON.stringify(previousState)} to ${JSON.stringify(newState)}.`;
    const text = await callModel(prompt);
    return text.trim();
}

module.exports = {
    generateEcosystem,
    generateCompanyDetails,
    generateAIOpportunity,
    generateNewsUpdate,
    _test: { callModel, extractJSON }
};
