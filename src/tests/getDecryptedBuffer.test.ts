import { CryptoCoreOptions } from "../types";
import CryptoCore from "../core/crypto-core";
import { getBufferFromUTF8String, getUTF8StringFromBuffer } from "../core/utils";

const options: CryptoCoreOptions = {
  OUTER_PEPPER: 'pepper is yum',
  INNER_KEY_ITERATIONS: 100,
};

let cryptoCore: CryptoCore;

beforeAll(() => {
  cryptoCore = new CryptoCore(options);
});

describe('getDecryptedBuffer', () => {
  it('decrypts a buffer correctly', async () => {
    const password = 'secret password';
    const plainText = 'Hello, World!';
    const plainBuffer = getBufferFromUTF8String(plainText);
    const salt = cryptoCore.getRandomSalt();
    const encryptResult = cryptoCore.getEncryptedBufferSync(plainBuffer, password, salt);
    const decryptedBuffer = cryptoCore.getDecryptedBufferSync(
      encryptResult.result,
      password,
      salt,
      encryptResult.iv,
      encryptResult.authTag,
    );
    expect(getUTF8StringFromBuffer(decryptedBuffer)).toBe(plainText);
  });
});
