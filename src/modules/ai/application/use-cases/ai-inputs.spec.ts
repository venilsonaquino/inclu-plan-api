import 'reflect-metadata';
import { validate } from 'class-validator';
import { GenerateBoardInput } from './generate-board/generate-board.input';
import { GenerateCardsInput } from './generate-cards/generate-cards.input';
import { GenerateHomeworkInput } from './generate-homework/generate-homework.input';
import { GenerateLessonInput } from './generate-lesson/generate-lesson.input';
import { plainToInstance } from 'class-transformer';

describe('AI Use Case Inputs', () => {
  describe('GenerateBoardInput', () => {
    it('should validate correctly', async () => {
      const input = plainToInstance(GenerateBoardInput, {
        theme: 'Space',
        objective: 'Learn planets',
        description: 'Interactive board',
        studentData: {
          name: 'John',
          grade: '1',
          profile: 'ADHD',
          adaptation: 'Visual aids',
        },
      });
      const errors = await validate(input);
      expect(errors).toHaveLength(0);
    });
  });

  describe('GenerateCardsInput', () => {
    it('should validate correctly', async () => {
      const input = plainToInstance(GenerateCardsInput, {
        theme: 'Animals',
        objective: 'Identify sounds',
        description: 'Animal cards',
        quantity: 10,
        studentData: {
          name: 'Jane',
          grade: '2',
          profile: 'ASD',
          adaptation: 'Clear labels',
        },
      });
      const errors = await validate(input);
      expect(errors).toHaveLength(0);
    });
  });

  describe('GenerateHomeworkInput', () => {
    it('should validate correctly', async () => {
      const input = plainToInstance(GenerateHomeworkInput, {
        theme: 'Math',
        objective: 'Sum numbers',
        description: 'Basic sum',
        studentData: {
          name: 'Bob',
          grade: '3',
          profile: 'Dyslexia',
          adaptation: 'Larger font',
        },
      });
      const errors = await validate(input);
      expect(errors).toHaveLength(0);
    });
  });

  describe('GenerateLessonInput', () => {
    it('should validate correctly', async () => {
      const input = plainToInstance(GenerateLessonInput, {
        days: [
          {
            day: 'Monday',
            disciplines: [
              {
                name: 'Math',
                theme: 'Addition',
              },
            ],
          },
        ],
        students: [
          {
            name: 'John',
            neurodivergencies: ['ASD'],
          },
        ],
      });
      const errors = await validate(input);
      expect(errors).toHaveLength(0);
    });
  });
});
