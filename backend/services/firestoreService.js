const config = require('../config/environment');

// Choose implementation based on configuration
let firestoreService;

if (config.USE_REAL_FIRESTORE) {
    console.log('Using real Firestore service');
    firestoreService = require('./firestoreService.real');
} else {
    console.log('Using mock Firestore service');
    
    // Mock implementation (in-memory)
    const Simulation = require('../simulation/Simulation');
    const llm = require('./llmService');
    const games = {};
    let gameCounter = 1;

    async function createGame() {
        const id = `game_${gameCounter++}`;
        games[id] = { id, status: 'lobby', actions: [], simulation: null, state: {} };
        return { id };
    }

    async function startGame(gameId, playerCount = 3) {
        const game = games[gameId];
        if (!game) throw new Error('Game not found');
        game.status = 'in-progress';
        game.simulation = new Simulation();
        game.state = game.simulation.state;
        // LLM integration to generate initial companies
        const ecosystem = await llm.generateEcosystem(playerCount);
        game.state.companies = [];
        for (const biz of ecosystem) {
            const details = await llm.generateCompanyDetails(biz.type || biz.name);
            game.state.companies.push({
                type: biz.type,
                name: biz.name,
                details
            });
        }
        return game.state;
    }

    async function getGameState(gameId) {
        const game = games[gameId];
        if (!game) throw new Error('Game not found');
        return game.state;
    }

    async function savePlayerAction(gameId, playerId, action) {
        const game = games[gameId];
        if (!game) throw new Error('Game not found');
        game.actions.push({ playerId, action });
        if (game.simulation) {
            const prev = JSON.parse(JSON.stringify(game.state));
            game.state = game.simulation.runQuarter();
            game.state.news = await llm.generateNewsUpdate(prev, game.state);
            for (const company of game.state.companies) {
                company.aiOpportunity = await llm.generateAIOpportunity(company);
            }
        }
        return game.state;
    }

    async function saveGMAction(gameId, command) {
        const game = games[gameId];
        if (!game) throw new Error('Game not found');
        game.actions.push({ gm: true, command });
        if (game.simulation) {
            const prev = JSON.parse(JSON.stringify(game.state));
            game.state = game.simulation.runQuarter();
            game.state.news = await llm.generateNewsUpdate(prev, game.state);
            for (const company of game.state.companies) {
                company.aiOpportunity = await llm.generateAIOpportunity(company);
            }
        }
        return game.state;
    }

    // Mock implementations for additional functions
    async function addPlayerToGame(gameId, playerId, playerData) {
        const game = games[gameId];
        if (!game) throw new Error('Game not found');
        if (!game.players) game.players = [];
        
        const existingPlayerIndex = game.players.findIndex(p => p.id === playerId);
        if (existingPlayerIndex >= 0) {
            game.players[existingPlayerIndex] = { id: playerId, ...playerData };
        } else {
            game.players.push({ id: playerId, ...playerData });
        }
        return game.players;
    }

    async function getGamePlayers(gameId) {
        const game = games[gameId];
        if (!game) throw new Error('Game not found');
        return game.players || [];
    }

    async function deleteGame(gameId) {
        delete games[gameId];
        return true;
    }

    firestoreService = {
        createGame,
        startGame,
        getGameState,
        savePlayerAction,
        saveGMAction,
        addPlayerToGame,
        getGamePlayers,
        deleteGame
    };
}

module.exports = firestoreService;
