import { CryptoCoreOptions } from "../types";
import CryptoCore from "../core/crypto-core";
import { getHexStringFromBuffer } from "../core/utils";

const options: CryptoCoreOptions = {
  OUTER_PEPPER: 'pepper is yum',
  INNER_KEY_ITERATIONS: 100,
};

let cryptoCore: CryptoCore;

beforeAll(() => {
  cryptoCore = new CryptoCore(options);
});

describe('getDecryptedString', () => {
  it('decrypts a string correctly', async () => {
    const password = 'secret password';
    const plainText = 'Hello, World!';
    const salt = cryptoCore.getRandomSalt();

    const encryptResult = cryptoCore.getEncryptedStringSync(plainText, password, salt);
    const decryptedString = cryptoCore.getDecryptedStringSync(
      getHexStringFromBuffer(encryptResult.result),
      password,
      salt,
      encryptResult.iv,
      encryptResult.authTag
    );

    expect(decryptedString).toBe(plainText);
  });
});
