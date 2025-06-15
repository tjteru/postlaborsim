const Simulation = require('../simulation/Simulation');
const games = {};
let gameCounter = 1;

async function createGame() {
    const id = `game_${gameCounter++}`;
    games[id] = { id, status: 'lobby', actions: [], simulation: null, state: {} };
    return { id };
}

async function startGame(gameId) {
    const game = games[gameId];
    if (!game) throw new Error('Game not found');
    game.status = 'in-progress';
    game.simulation = new Simulation();
    game.state = game.simulation.state;
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
        game.state = game.simulation.runQuarter();
    }
}

async function saveGMAction(gameId, command) {
    const game = games[gameId];
    if (!game) throw new Error('Game not found');
    game.actions.push({ gm: true, command });
    if (game.simulation) {
        game.state = game.simulation.runQuarter();
    }
}

module.exports = {
    createGame,
    startGame,
    getGameState,
    savePlayerAction,
    saveGMAction
};
