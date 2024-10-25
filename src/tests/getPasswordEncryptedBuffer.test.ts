import { CryptoCoreOptions } from "../types";
import CryptoCore from "../core/crypto-core";
import { getBufferFromUTF8String, getHexStringFromBuffer } from "../core/utils";

const options: CryptoCoreOptions = {
  OUTER_PEPPER: 'pepper is yum',
  INNER_KEY_ITERATIONS: 100,
};

let cryptoCore: CryptoCore;

beforeAll(() => {
  cryptoCore = new CryptoCore(options);
});

describe('getPasswordEncryptedBuffer', () => {
  it('encrypts a buffer correctly', async () => {
    const password = 'my_secret_password';
    const plainBuffer = getBufferFromUTF8String('Hello, World!');
    const encryptedBuffer = cryptoCore.getPasswordEncryptedBufferSync(plainBuffer, password);

    expect(encryptedBuffer).toBeInstanceOf(Buffer);
    expect(getHexStringFromBuffer(encryptedBuffer)).not.toEqual(getHexStringFromBuffer(plainBuffer));
  });
});
