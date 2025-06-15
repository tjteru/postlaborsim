jest.mock('@google/generative-ai', () => {
  const mockGenerateContent = jest.fn();
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({ generateContent: mockGenerateContent })
    })),
    __mockGenerateContent: mockGenerateContent
  };
});

const { __mockGenerateContent } = require('@google/generative-ai');

const llm = require('../services/llmService');

beforeEach(() => {
  __mockGenerateContent.mockReset();
});

test('generateEcosystem returns parsed JSON', async () => {
  __mockGenerateContent.mockResolvedValue({ response: { text: () => Promise.resolve('[{"name":"Biz","type":"bakery"}]') } });
  const result = await llm.generateEcosystem(1);
  expect(__mockGenerateContent).toHaveBeenCalled();
  const prompt = __mockGenerateContent.mock.calls[0][0];
  expect(prompt).toMatch(/Generate a JSON array/);
  expect(Array.isArray(result)).toBe(true);
  expect(result[0].name).toBe('Biz');
});

test('generateCompanyDetails returns object', async () => {
  __mockGenerateContent.mockResolvedValue({ response: { text: () => Promise.resolve('{"name":"TestCo"}') } });
  const result = await llm.generateCompanyDetails('bakery');
  expect(__mockGenerateContent).toHaveBeenCalled();
  expect(result).toHaveProperty('name', 'TestCo');
});

test('generateAIOpportunity returns object', async () => {
  __mockGenerateContent.mockResolvedValue({ response: { text: () => Promise.resolve('{"title":"AI"}') } });
  const result = await llm.generateAIOpportunity({ name: 'Biz' });
  expect(__mockGenerateContent).toHaveBeenCalled();
  expect(result).toHaveProperty('title', 'AI');
});

test('generateNewsUpdate returns text', async () => {
  __mockGenerateContent.mockResolvedValue({ response: { text: () => Promise.resolve('News') } });
  const result = await llm.generateNewsUpdate({}, {});
  expect(__mockGenerateContent).toHaveBeenCalled();
  expect(result).toBe('News');
});
