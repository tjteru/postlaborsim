const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

async function callModel(prompt) {
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
