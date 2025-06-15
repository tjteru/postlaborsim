const express = require('express');
const firestore = require('../services/firestoreService');
const Simulation = require('../simulation/Simulation');

module.exports = (io) => {
    const router = express.Router();

    router.post('/create', async (req, res) => {
        try {
            const game = await firestore.createGame();
            res.json({ gameId: game.id });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to create game' });
        }
    });

    router.post('/:gameId/start', async (req, res) => {
        const { gameId } = req.params;
        try {
            const state = await firestore.startGame(gameId);
            io.to(gameId).emit('gameStarted', state);
            res.json(state);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to start game' });
        }
    });

    router.get('/:gameId/state', async (req, res) => {
        const { gameId } = req.params;
        try {
            const state = await firestore.getGameState(gameId);
            res.json(state);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch state' });
        }
    });

    return router;
};
