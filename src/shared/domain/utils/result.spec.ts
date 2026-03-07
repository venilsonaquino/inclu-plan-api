import { Result } from './result';

describe('Result', () => {
  describe('ok', () => {
    it('should create a successful result', () => {
      const result = Result.ok('test');
      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.getValue()).toBe('test');
      expect(result.error).toBeNull();
    });

    it('should create a successful result without value', () => {
      const result = Result.ok();
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeNull();
    });
  });

  describe('fail', () => {
    it('should create a failing result', () => {
      const result = Result.fail('error message');
      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.errorValue()).toBe('error message');
      expect(() => result.getValue()).toThrow("Can't get the value of an error result. Use 'error' instead.");
    });
  });

  describe('combine', () => {
    it('should return ok if all results are successful', () => {
      const result1 = Result.ok(1);
      const result2 = Result.ok(2);
      const combined = Result.combine([result1, result2]);
      expect(combined.isSuccess).toBe(true);
    });

    it('should return first failure if any result fails', () => {
      const result1 = Result.ok(1);
      const result2 = Result.fail('error2');
      const result3 = Result.fail('error3');
      const combined = Result.combine([result1, result2, result3]);
      expect(combined.isFailure).toBe(true);
      expect(combined.errorValue()).toBe('error2');
    });
  });

  describe('constructor validation', () => {
    it('should throw if success with error', () => {
      // @ts-expect-error: testing internal constructor validation
      expect(() => new Result(true, 'error')).toThrow(
        'InvalidOperation: A result cannot be successful and contain an error',
      );
    });

    it('should throw if failure without error', () => {
      // @ts-expect-error: testing internal constructor validation
      expect(() => new Result(false, null)).toThrow(
        'InvalidOperation: A failing result needs to contain an error message',
      );
    });
  });
});
