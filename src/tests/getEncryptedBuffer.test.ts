import { CryptoCoreOptions } from "../types";
import CryptoCore from "../core/crypto-core";
import { getBufferFromUTF8String } from "../core/utils";

const options: CryptoCoreOptions = {
  OUTER_PEPPER: 'pepper is yum',
  INNER_KEY_ITERATIONS: 100,
};

let cryptoCore: CryptoCore;

beforeAll(() => {
  cryptoCore = new CryptoCore(options);
});

describe('getEncryptedBuffer', () => {
  it('encrypts a buffer correctly', async () => {
    const password = 'secret password';
    const plainText = 'Hello, World!';
    const plainBuffer = getBufferFromUTF8String(plainText);
    const salt = cryptoCore.getRandomSalt();
    const encryptResult = cryptoCore.getEncryptedBufferSync(plainBuffer, password, salt);

    expect(encryptResult.result).not.toBe(plainBuffer);
    expect(typeof encryptResult.iv).toBe('string');
    expect(encryptResult.iv.length).toBe(32);
    expect(typeof encryptResult.authTag).toBe('string');
    expect(encryptResult.authTag.length).toBe(32);
  });
});
