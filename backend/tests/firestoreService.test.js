const firestore = require('../services/firestoreService');

describe('firestoreService', () => {
  it('creates and starts a game, saving actions', async () => {
    const { id } = await firestore.createGame();
    expect(id).toMatch(/game_/);

    const state = await firestore.startGame(id);
    expect(state).toHaveProperty('quarter', 1);

    await firestore.savePlayerAction(id, 'player1', { type: 'test' });
    const newState = await firestore.getGameState(id);
    expect(newState.quarter).toBe(2);
  });
});
