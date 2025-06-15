const { getFirestore } = require('../config/firebase');
const Simulation = require('../simulation/Simulation');
const llm = require('./llmService');

const db = getFirestore();

async function createGame() {
    try {
        const gameData = {
            status: 'lobby',
            createdAt: new Date(),
            actions: [],
            state: {},
            players: []
        };
        
        const docRef = await db.collection('games').add(gameData);
        return { id: docRef.id };
    } catch (error) {
        console.error('Error creating game:', error);
        throw new Error('Failed to create game');
    }
}

async function startGame(gameId, playerCount = 3) {
    try {
        const gameRef = db.collection('games').doc(gameId);
        const gameDoc = await gameRef.get();
        
        if (!gameDoc.exists) {
            throw new Error('Game not found');
        }
        
        const simulation = new Simulation();
        const state = simulation.state;
        
        // LLM integration to generate initial companies
        const ecosystem = await llm.generateEcosystem(playerCount);
        state.companies = [];
        
        for (const biz of ecosystem) {
            const details = await llm.generateCompanyDetails(biz.type || biz.name);
            state.companies.push({
                type: biz.type,
                name: biz.name,
                details
            });
        }
        
        await gameRef.update({
            status: 'in-progress',
            state: state,
            updatedAt: new Date()
        });
        
        return state;
    } catch (error) {
        console.error('Error starting game:', error);
        throw new Error('Failed to start game');
    }
}

async function getGameState(gameId) {
    try {
        const gameDoc = await db.collection('games').doc(gameId).get();
        
        if (!gameDoc.exists) {
            throw new Error('Game not found');
        }
        
        const gameData = gameDoc.data();
        return gameData.state || {};
    } catch (error) {
        console.error('Error getting game state:', error);
        throw new Error('Failed to get game state');
    }
}

async function savePlayerAction(gameId, playerId, action) {
    try {
        const gameRef = db.collection('games').doc(gameId);
        const gameDoc = await gameRef.get();
        
        if (!gameDoc.exists) {
            throw new Error('Game not found');
        }
        
        const gameData = gameDoc.data();
        
        // Add action to actions array
        const actions = gameData.actions || [];
        actions.push({
            playerId,
            action,
            timestamp: new Date()
        });
        
        // Run simulation if game is in progress
        let newState = gameData.state;
        if (gameData.status === 'in-progress' && gameData.state) {
            const simulation = new Simulation();
            simulation.state = gameData.state;
            
            const prevState = JSON.parse(JSON.stringify(gameData.state));
            newState = simulation.runQuarter();
            
            // Generate news and AI opportunities
            newState.news = await llm.generateNewsUpdate(prevState, newState);
            
            for (const company of newState.companies) {
                company.aiOpportunity = await llm.generateAIOpportunity(company);
            }
        }
        
        await gameRef.update({
            actions: actions,
            state: newState,
            updatedAt: new Date()
        });
        
        return newState;
    } catch (error) {
        console.error('Error saving player action:', error);
        throw new Error('Failed to save player action');
    }
}

async function saveGMAction(gameId, command) {
    try {
        const gameRef = db.collection('games').doc(gameId);
        const gameDoc = await gameRef.get();
        
        if (!gameDoc.exists) {
            throw new Error('Game not found');
        }
        
        const gameData = gameDoc.data();
        
        // Add GM action to actions array
        const actions = gameData.actions || [];
        actions.push({
            gm: true,
            command,
            timestamp: new Date()
        });
        
        // Run simulation if game is in progress
        let newState = gameData.state;
        if (gameData.status === 'in-progress' && gameData.state) {
            const simulation = new Simulation();
            simulation.state = gameData.state;
            
            const prevState = JSON.parse(JSON.stringify(gameData.state));
            newState = simulation.runQuarter();
            
            // Generate news and AI opportunities
            newState.news = await llm.generateNewsUpdate(prevState, newState);
            
            for (const company of newState.companies) {
                company.aiOpportunity = await llm.generateAIOpportunity(company);
            }
        }
        
        await gameRef.update({
            actions: actions,
            state: newState,
            updatedAt: new Date()
        });
        
        return newState;
    } catch (error) {
        console.error('Error saving GM action:', error);
        throw new Error('Failed to save GM action');
    }
}

async function addPlayerToGame(gameId, playerId, playerData) {
    try {
        const gameRef = db.collection('games').doc(gameId);
        const gameDoc = await gameRef.get();
        
        if (!gameDoc.exists) {
            throw new Error('Game not found');
        }
        
        const gameData = gameDoc.data();
        const players = gameData.players || [];
        
        // Check if player already exists
        const existingPlayerIndex = players.findIndex(p => p.id === playerId);
        if (existingPlayerIndex >= 0) {
            players[existingPlayerIndex] = { id: playerId, ...playerData, updatedAt: new Date() };
        } else {
            players.push({ id: playerId, ...playerData, joinedAt: new Date() });
        }
        
        await gameRef.update({
            players: players,
            updatedAt: new Date()
        });
        
        return players;
    } catch (error) {
        console.error('Error adding player to game:', error);
        throw new Error('Failed to add player to game');
    }
}

async function getGamePlayers(gameId) {
    try {
        const gameDoc = await db.collection('games').doc(gameId).get();
        
        if (!gameDoc.exists) {
            throw new Error('Game not found');
        }
        
        const gameData = gameDoc.data();
        return gameData.players || [];
    } catch (error) {
        console.error('Error getting game players:', error);
        throw new Error('Failed to get game players');
    }
}

async function deleteGame(gameId) {
    try {
        await db.collection('games').doc(gameId).delete();
        return true;
    } catch (error) {
        console.error('Error deleting game:', error);
        throw new Error('Failed to delete game');
    }
}

module.exports = {
    createGame,
    startGame,
    getGameState,
    savePlayerAction,
    saveGMAction,
    addPlayerToGame,
    getGamePlayers,
    deleteGame
};