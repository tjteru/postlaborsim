const express = require('express');
const firestore = require('../services/firestoreService');

module.exports = (io) => {
    const router = express.Router();

    router.post('/action', async (req, res) => {
        const { gameId, command } = req.body;
        try {
            await firestore.saveGMAction(gameId, command);
            io.to(gameId).emit('shockEvent', command);
            res.json({ status: 'ok' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to process command' });
        }
    });

    return router;
};
