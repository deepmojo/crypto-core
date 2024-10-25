import { CryptoCoreOptions } from "../types";
import CryptoCore from "../core/crypto-core";

const options: CryptoCoreOptions = {
  OUTER_PEPPER: 'pepper is yum',
  INNER_KEY_ITERATIONS: 100,
};

let cryptoCore: CryptoCore;

beforeAll(() => {
  cryptoCore = new CryptoCore(options);
});

describe('getDerivedKeyAndIv', () => {
  const testPassword = 'my_secret_password';
  const testSalt = 'my_secret_salt';

  it('returns a DerivedKeyAndIvObject', async () => {
    const result = cryptoCore.getDerivedKeyAndIvSync(testPassword, testSalt);
    expect(result).toBeInstanceOf(Object);
    expect(result).toHaveProperty('key');
    expect(result).toHaveProperty('iv');
  });

  it('key property is a Buffer with length 32', async () => {
    const { key } = cryptoCore.getDerivedKeyAndIvSync(testPassword, testSalt);
    expect(key).toBeInstanceOf(Buffer);
    expect(key.length).toBe(32);
  });

  it('iv property is a Buffer with length 16', async () => {
    const { iv } = cryptoCore.getDerivedKeyAndIvSync(testPassword, testSalt);
    expect(iv).toBeInstanceOf(Buffer);
    expect(iv.length).toBe(16);
  });
});
