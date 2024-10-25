import { CryptoCoreOptions } from "../types";
import CryptoCore from "../core/crypto-core";
import { getUTF8StringFromBuffer } from "../core/utils";

const options: CryptoCoreOptions = {
  OUTER_PEPPER: 'pepper is yum',
  INNER_KEY_ITERATIONS: 100,
};

let cryptoCore: CryptoCore;

beforeAll(() => {
  cryptoCore = new CryptoCore(options);
});

describe('getEncryptedString', () => {
  it('encrypts a string correctly', async () => {
    const password = 'secret password';
    const plainText = 'Hello, World!';
    const salt = cryptoCore.getRandomSalt();
    const encryptResult = cryptoCore.getEncryptedStringSync(plainText, password, salt);
    const encryptResultText = getUTF8StringFromBuffer(encryptResult.result);
    expect(encryptResultText).not.toBe(plainText);
  });
});
