import { Test, TestingModule } from '@nestjs/testing';
import { GeminiProvider } from './gemini.provider';

describe('GeminiProvider', () => {
  let provider: GeminiProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeminiProvider],
    }).compile();

    provider = module.get<GeminiProvider>(GeminiProvider);

    // Clear mocks and env before each test
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test_api_key';

    // Polyfill fetch if necessary or spy on global fetch
    global.fetch = jest.fn();
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('getApiKey', () => {
    it('should throw an error if GEMINI_API_KEY is not defined', async () => {
      delete process.env.GEMINI_API_KEY;
      await expect(provider.generateText('sys', 'prompt')).rejects.toThrow('GEMINI_API_KEY is not defined in environment variables.');
    });
  });

  describe('generateText', () => {
    it('should return parsed JSON data on successful request', async () => {
      const mockResponseBody = {
        candidates: [
          {
            content: { parts: [{ text: '{"result": "success"}' }] },
            finishReason: 'STOP',
          }
        ],
        usageMetadata: {
          promptTokenCount: 10,
          candidatesTokenCount: 20,
          totalTokenCount: 30,
        }
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponseBody),
      });

      const result = await provider.generateText('system', 'user');
      expect(result).toEqual({ result: 'success' });
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should include image data if imagePartBase64 is provided', async () => {
      const mockResponseBody = {
        candidates: [{ content: { parts: [{ text: '{"success": true}' }] } }]
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponseBody),
      });

      await provider.generateText('system', 'user', 'base64image');

      const fetchCallArgs = (global.fetch as jest.Mock).mock.calls[0];
      const requestBody = JSON.parse(fetchCallArgs[1].body);

      expect(requestBody.contents[0].parts[0].inlineData).toBeDefined();
      expect(requestBody.contents[0].parts[0].inlineData.data).toBe('base64image');
    });

    it('should throw an error if API response is not ok', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: jest.fn().mockRejectedValue(new Error('no json body')),
      });

      await expect(provider.generateText('sys', 'prompt')).rejects.toThrow('Gemini API error: 500');
    });

    it('should throw an error if rawText is missing (blocked or failed)', async () => {
      const mockResponseBody = {
        candidates: [
          {
            content: { parts: [] },
            finishReason: 'SAFETY',
          }
        ]
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponseBody),
      });

      await expect(provider.generateText('sys', 'prompt')).rejects.toThrow('AI generation failed or was blocked. Reason: SAFETY');
    });
  });

  describe('generateImage', () => {
    it('should return base64 encoded string on success', async () => {
      const mockResponse = {
        candidates: [{ content: { parts: [{ inlineData: { data: 'base64string' } }] } }]
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await provider.generateImage('draw a cat');
      expect(result).toBe('base64string');
    });

    it('should return null if response is not ok (400, 500, etc)', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue({ error: { message: 'bad request' } }),
      });

      const result = await provider.generateImage('draw a cat');
      expect(result).toBeNull();
    });

    it('should return null if generate process throws an exception', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));
      const result = await provider.generateImage('draw a cat');
      expect(result).toBeNull();
    });

    it('should return null if response format is unexpected', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ candidates: [] }),
      });

      const result = await provider.generateImage('draw a cat');
      expect(result).toBeNull();
    });
  });
});
