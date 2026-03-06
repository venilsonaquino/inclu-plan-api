import { Test, TestingModule } from '@nestjs/testing';
import { GeminiProvider } from './gemini.provider';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('GeminiProvider', () => {
  let provider: GeminiProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeminiProvider],
    }).compile();

    provider = module.get<GeminiProvider>(GeminiProvider);
    jest.clearAllMocks();
    process.env.GEMINI_API_KEY = 'test_api_key';
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
      await expect(provider.generateText('sys', 'prompt')).rejects.toThrow(
        'GEMINI_API_KEY is not defined in environment variables.',
      );
    });
  });

  describe('generateText', () => {
    it('should return parsed JSON data on successful request', async () => {
      const mockResponseBody = {
        candidates: [
          {
            content: { parts: [{ text: '{"result": "success"}' }] },
            finishReason: 'STOP',
          },
        ],
        usageMetadata: {
          promptTokenCount: 10,
          candidatesTokenCount: 20,
          totalTokenCount: 30,
        },
      };

      mockedAxios.post.mockResolvedValue({
        data: mockResponseBody,
      });

      const result = await provider.generateText('system', 'user');
      expect(result).toEqual({ result: 'success' });
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    it('should include image data if imagePartBase64 is provided', async () => {
      const mockResponseBody = {
        candidates: [{ content: { parts: [{ text: '{"success": true}' }] } }],
      };

      mockedAxios.post.mockResolvedValue({
        data: mockResponseBody,
      });

      await provider.generateText('system', 'user', 'base64image');

      const fetchCallArgs = mockedAxios.post.mock.calls[0];
      const requestBody = fetchCallArgs[1] as any;

      expect(requestBody.contents[0].parts[0].inlineData).toBeDefined();
      expect(requestBody.contents[0].parts[0].inlineData.data).toBe(
        'base64image',
      );
    });

    it('should throw an error if API response is not ok', async () => {
      const errorResponse = {
        isAxiosError: true,
        response: {
          status: 500,
          data: { error: { message: 'Gemini API Internal Server Error' } },
        },
      };
      mockedAxios.isAxiosError.mockReturnValue(true);
      mockedAxios.post.mockRejectedValue(errorResponse);

      await expect(provider.generateText('sys', 'prompt')).rejects.toThrow(
        'Gemini API Internal Server Error',
      );
    });

    it('should throw an error if rawText is missing (blocked or failed)', async () => {
      const mockResponseBody = {
        candidates: [
          {
            content: { parts: [] },
            finishReason: 'SAFETY',
          },
        ],
      };

      mockedAxios.post.mockResolvedValue({
        data: mockResponseBody,
      });

      await expect(provider.generateText('sys', 'prompt')).rejects.toThrow(
        'AI generation failed or was blocked. Reason: SAFETY',
      );
    });
  });

  describe('generateImage', () => {
    it('should return base64 encoded string on success', async () => {
      const mockResponse = {
        candidates: [
          { content: { parts: [{ inlineData: { data: 'base64string' } }] } },
        ],
      };

      mockedAxios.post.mockResolvedValue({
        data: mockResponse,
      });

      const result = await provider.generateImage('draw a cat');
      expect(result).toBe('base64string');
    });

    it('should return null if response is not ok (400, 500, etc)', async () => {
      const errorResponse = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { error: { message: 'bad request' } },
        },
      };
      mockedAxios.isAxiosError.mockReturnValue(true);
      mockedAxios.post.mockRejectedValue(errorResponse);

      const result = await provider.generateImage('draw a cat');
      expect(result).toBeNull();
    });

    it('should return null if generate process throws an exception', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network error'));
      const result = await provider.generateImage('draw a cat');
      expect(result).toBeNull();
    });

    it('should return null if response format is unexpected', async () => {
      mockedAxios.post.mockResolvedValue({
        data: { candidates: [] },
      });

      const result = await provider.generateImage('draw a cat');
      expect(result).toBeNull();
    });
    describe('generateEmbeddings', () => {
      it('should return an array of numbers representing the vector', async () => {
        const mockVector = [0.1, 0.2, -0.3];
        mockedAxios.post.mockResolvedValueOnce({
          data: {
            embedding: {
              values: mockVector,
            },
          },
        });

        const result = await provider.generateEmbeddings(
          'Test text for embedding',
        );

        expect(result).toEqual(mockVector);
        expect(mockedAxios.post).toHaveBeenCalledWith(
          expect.stringContaining('gemini-embedding-001:embedContent'),
          expect.objectContaining({
            model: 'models/gemini-embedding-001',
            content: { parts: [{ text: 'Test text for embedding' }] },
          }),
          expect.any(Object),
        );
      });

      it('should throw an error if the array is missing or malformed', async () => {
        mockedAxios.post.mockResolvedValueOnce({
          data: {}, // missing embedding.values
        });

        await expect(provider.generateEmbeddings('Test text')).rejects.toThrow(
          'Failed to extract embedding array from Google AI response.',
        );
      });

      it('should throw an error if API response is not ok', async () => {
        mockedAxios.post.mockRejectedValueOnce({
          isAxiosError: true,
          response: {
            status: 400,
            data: {
              error: {
                message: 'Invalid request',
              },
            },
          },
        });

        await expect(provider.generateEmbeddings('Test text')).rejects.toThrow(
          'Invalid request',
        );
      });
    });
  });
});
