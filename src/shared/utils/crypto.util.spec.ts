import { CryptoUtil } from './crypto.util';

describe('CryptoUtil', () => {
  it('should hash a password and return a salt:key format', async () => {
    const password = 'mySecretPassword123';
    const hash = await CryptoUtil.hash(password);

    expect(hash).toBeDefined();
    expect(hash).toContain(':');

    const [salt, key] = hash.split(':');
    expect(salt).toHaveLength(32); // 16 bytes hex string
    expect(key).toHaveLength(64); // 32 bytes hex string
  });

  it('should return true for correct password comparison', async () => {
    const password = 'mySecretPassword123';
    const hash = await CryptoUtil.hash(password);

    const isMatch = await CryptoUtil.compare(password, hash);
    expect(isMatch).toBe(true);
  });

  it('should return false for incorrect password comparison', async () => {
    const password = 'mySecretPassword123';
    const wrongPassword = 'wrongPassword123';
    const hash = await CryptoUtil.hash(password);

    const isMatch = await CryptoUtil.compare(wrongPassword, hash);
    expect(isMatch).toBe(false);
  });

  it('should return false if hash format is invalid', async () => {
    const isMatch = await CryptoUtil.compare('password', 'invalidhashformat');
    expect(isMatch).toBe(false);
  });
});
