import { Result } from '../utils/result';

export interface UseCase<IN, OUT> {
  execute(data: IN): Promise<Result<OUT>>;
}
