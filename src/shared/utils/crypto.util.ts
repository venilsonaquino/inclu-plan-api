import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

export class CryptoUtil {

  static async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await promisify(scrypt)(password, salt, 32)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    const [salt, key] = hash.split(':');

    if (!salt || !key) return false;

    const keyBuffer = Buffer.from(key, 'hex');
    const derivedKey = (await promisify(scrypt)(password, salt, 32)) as Buffer;

    try {
      return timingSafeEqual(keyBuffer, derivedKey);
    } catch {
      return false;
    }
  }
}
