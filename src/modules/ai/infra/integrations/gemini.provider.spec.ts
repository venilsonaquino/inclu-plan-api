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
    process.env.GEMINI_API_KEY = 'test-key';
  });

  describe('generateText', () => {
    it('should return parsed JSON on success', async () => {
      const mockResult = { key: 'value' };
      mockedAxios.post.mockResolvedValue({
        data: {
          candidates: [{
            content: { parts: [{ text: JSON.stringify(mockResult) }] },
            finishReason: 'STOP'
          }],
          usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 10 }
        }
      });

      const result = await provider.generateText('system', 'user');
      expect(result).toEqual(mockResult);
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    it('should throw error if rawText is missing', async () => {
      mockedAxios.post.mockResolvedValue({
        data: { candidates: [] }
      });

      await expect(provider.generateText('s', 'u')).rejects.toThrow('AI generation failed');
    });

    it('should log and throw on JSON parse failure', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          candidates: [{
            content: { parts: [{ text: 'invalid-json' }] }
          }]
        }
      });

      await expect(provider.generateText('s', 'u')).rejects.toThrow();
    });

    it('should handle axios errors', async () => {
      const error = {
        isAxiosError: true,
        response: {
          status: 400,
          data: { error: { message: 'Api Error' } }
        }
      };
      mockedAxios.post.mockRejectedValue(error);
      (axios.isAxiosError as any) = jest.fn().mockReturnValue(true);

      await expect(provider.generateText('s', 'u')).rejects.toThrow('Api Error');
    });
  });

  describe('generateImage', () => {
    it('should return base64 string on success', async () => {
      mockedAxios.post.mockResolvedValue({
        data: {
          candidates: [{
            content: { parts: [{ inlineData: { data: 'base64str' } }] }
          }]
        }
      });

      const result = await provider.generateImage('prompt');
      expect(result).toBe('base64str');
    });

    it('should return null on failure', async () => {
      mockedAxios.post.mockRejectedValue(new Error('error'));
      const result = await provider.generateImage('prompt');
      expect(result).toBeNull();
    });
  });

  describe('generateEmbeddings', () => {
    it('should return number array', async () => {
      mockedAxios.post.mockResolvedValue({
        data: { embedding: { values: [0.1, 0.2] } }
      });

      const result = await provider.generateEmbeddings('text');
      expect(result).toEqual([0.1, 0.2]);
    });

    it('should throw if no embedding values', async () => {
      mockedAxios.post.mockResolvedValue({ data: {} });
      await expect(provider.generateEmbeddings('text')).rejects.toThrow('Failed to extract embedding');
    });
  });
});
