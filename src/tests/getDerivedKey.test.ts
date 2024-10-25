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

describe('getDerivedKey', () => {
  const testPassword = 'my_secret_password';
  const testSalt = 'my_secret_salt';

  it('returns a Buffer', async () => {
    const result = cryptoCore.getDerivedKeySync(testPassword, testSalt);
    expect(result).toBeInstanceOf(Buffer);
  });

  it('returns a Buffer with length 32', async () => {
    const result = cryptoCore.getDerivedKeySync(testPassword, testSalt);
    expect(result.length).toBe(32);
  });
});
