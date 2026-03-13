import { ListGradesUseCase } from './list-grades.use-case';
import { Grade } from '@/modules/grades/domain/entities/grade.entity';

describe('ListGradesUseCase', () => {
  let useCase: ListGradesUseCase;
  let repository: any;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
    };
    useCase = new ListGradesUseCase(repository);
  });

  it('should return a list of grades sorted by position', async () => {
    const grades = [
      new Grade({
        name: '2º Ano',
        position: 2,
        createdAt: new Date('2023-01-02'),
      }),
      new Grade({
        name: '1º Ano',
        position: 1,
        createdAt: new Date('2023-01-01'),
      }),
    ];

    repository.findAll.mockResolvedValue(grades);

    const result = await useCase.execute();

    expect(result.isSuccess).toBe(true);
    const value = result.getValue();
    expect(value).toHaveLength(2);
    expect(value[0].name).toBe('1º Ano');
    expect(value[0].position).toBe(1);
    expect(value[1].name).toBe('2º Ano');
    expect(value[1].position).toBe(2);
  });

  it('should return an empty list if no grades found', async () => {
    repository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toHaveLength(0);
  });

  it('should return failure if repository throws', async () => {
    repository.findAll.mockRejectedValue(new Error('DB error'));

    const result = await useCase.execute();

    expect(result.isFailure).toBe(true);
    expect(result.errorValue()).toBe('An unexpected error occurred while listing the grade levels.');
  });
});
