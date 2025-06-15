jest.mock('../services/llmService', () => ({
  generateEcosystem: jest.fn().mockResolvedValue([]),
  generateCompanyDetails: jest.fn().mockResolvedValue({}),
  generateAIOpportunity: jest.fn().mockResolvedValue({}),
  generateNewsUpdate: jest.fn().mockResolvedValue('')
}));

const request = require('supertest');
const { app, server } = require('../server');

afterAll(() => {
  server.close();
});

describe('API routes', () => {
  it('creates and starts a game via API', async () => {
    const createRes = await request(app).post('/api/game/create');
    expect(createRes.status).toBe(200);
    const { gameId } = createRes.body;
    expect(gameId).toMatch(/game_/);

    const startRes = await request(app).post(`/api/game/${gameId}/start`);
    expect(startRes.status).toBe(200);
    expect(startRes.body).toHaveProperty('quarter', 1);
  });
});
