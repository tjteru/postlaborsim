const express = require('express');
const firestore = require('../services/firestoreService');

module.exports = (io) => {
    const router = express.Router();

    router.post('/action', async (req, res) => {
        const { gameId, playerId, action } = req.body;
        try {
            await firestore.savePlayerAction(gameId, playerId, action);
            io.to(gameId).emit('decisionReceived', { playerId });
            res.json({ status: 'ok' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to save action' });
        }
    });

    return router;
};
