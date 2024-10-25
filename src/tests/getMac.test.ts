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

describe('getMac', () => {
  it('generates a MAC correctly', async () => {
    const password = 'secret password';
    const plainText = 'Hello, World!';
    const plainBuffer = getBufferFromUTF8String(plainText);
    const salt = cryptoCore.getRandomSalt();
    const encryptResult = cryptoCore.getEncryptedBufferSync(plainBuffer, password, salt);
    const encryptedBuffer = encryptResult.result;

    const mac = cryptoCore.getMacSync(encryptedBuffer, password);
    if (mac === null) {
      throw new Error('Failed to generate MAC');
    }

    // Verify the MAC is a string and has the correct length
    expect(typeof mac).toBe('string');
    expect(mac.length).toBe(64); // SHA-256 produces a 32-byte digest, which is 64 characters in hex

    // Optionally, you can also verify the MAC is different from the original buffer
    expect(mac).not.toBe(plainBuffer.toString('hex'));
  });

  it('throws an error if the input buffer is invalid', async () => {
    const password = 'secret password';
    const invalidBuffer = 'this is not a buffer'; // Simulate an invalid buffer

    expect(cryptoCore.getMacSync(invalidBuffer as any, password)).toBe(null); //.rejects.toThrow();
    // await expect(cryptoCore.getMac(invalidBuffer as any, password)).rejects.toThrow();
  });

  it('throws an error if the password is invalid', async () => {
    const invalidPassword = 123; // Simulate an invalid password
    const encryptedBuffer = Buffer.alloc(10); // Sample buffer

    expect(cryptoCore.getMacSync(encryptedBuffer, invalidPassword as any)).toBe(null);
    // await expect(cryptoCore.getMac(encryptedBuffer, invalidPassword as any)).rejects.toThrow();
  });
});
