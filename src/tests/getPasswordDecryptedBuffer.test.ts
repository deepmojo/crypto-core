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

describe('getPasswordDecryptedBuffer', () => {
  it('decrypts a buffer correctly', async () => {
    const password = 'my_secret_password';
    const plainBuffer = getBufferFromUTF8String('Hello, World!');
    const encryptedBuffer = cryptoCore.getPasswordEncryptedBufferSync(plainBuffer, password);
    const decryptedBuffer = cryptoCore.getPasswordDecryptedBufferSync(encryptedBuffer, password);

    const plainString = getUTF8StringFromBuffer(plainBuffer);
    const decryptedString = getUTF8StringFromBuffer(decryptedBuffer);

    expect(decryptedBuffer).toBeInstanceOf(Buffer);
    expect(decryptedString).toEqual(plainString);
  });
});
