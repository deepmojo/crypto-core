
import {
  AES_256_ECB, AES_256_GCM, CryptoCoreOptions, DerivedKeyAndIvObject, HexString, SHA_256, SecureEncryptionResult
} from "../types";
import {
  createCipheriv, createDecipheriv, createHash, createHmac, createPrivateKey,
  createPublicKey, createSign, createVerify, generateKeyPair, pbkdf2, pbkdf2Sync, randomBytes, HashOptions,
  PrivateKeyInput, KeyObject, Verify, Sign, Hash, RSAKeyPairOptions
} from "node:crypto";
import { WritableOptions } from "node:stream";
import { getBase64StringFromBuffer, getBufferFromBase64String, getBufferFromHexString, getBufferFromUTF8String, getHexStringFromBuffer, getUTF8StringFromBuffer } from "./utils";

export interface RSAKeyPairOptionsPEM extends RSAKeyPairOptions<"pem", "pem"> {}
export type GenerateKeypairCallback = (err: Error | null, publicKey: string, privateKey: string) => void;

class CryptoCore {
  private HASH_ALGO: SHA_256;
  private OUTER_CIPHER: AES_256_ECB;
  private OUTER_PEPPER: string;
  private INNER_CIPHER: AES_256_GCM;
  private INNER_KEY_ITERATIONS: number;
  private INNER_KEY_BYTES: number;
  private INNER_IV_BYTES: number;
  private INNER_SALT_BYTES: number;
  private MAC_ALGO: SHA_256;

  constructor(options?: CryptoCoreOptions) {
    this.HASH_ALGO = 'sha256';
    this.MAC_ALGO = 'sha256';

    this.OUTER_CIPHER = 'aes-256-ecb';
    this.OUTER_PEPPER = (options && typeof options.OUTER_PEPPER === 'string')
      ? getHexStringFromBuffer(createHash(this.HASH_ALGO).update(options.OUTER_PEPPER).digest())
      : '';

    this.INNER_CIPHER = 'aes-256-gcm';
    this.INNER_KEY_BYTES = 32; // 32 = 256-bit = 64 chars
    this.INNER_IV_BYTES = 16; // 16 = 128-bit = 32 chars
    this.INNER_SALT_BYTES = 16; // 16 = 128-bit = 32 chars
    this.INNER_KEY_ITERATIONS = (options && typeof options.INNER_KEY_ITERATIONS === 'number')
      ? options.INNER_KEY_ITERATIONS
      : 0;
  }

  public getRandomSalt(): HexString {
    return getHexStringFromBuffer(randomBytes(this.INNER_SALT_BYTES));
  }

  public async getDerivedKeyAndIv(password: string, salt: HexString): Promise<DerivedKeyAndIvObject> {
    const derivedKeyBuffer = await new Promise<Buffer>((resolve, reject) => {
      pbkdf2(
        password,
        salt,
        this.INNER_KEY_ITERATIONS,
        this.INNER_KEY_BYTES + this.INNER_IV_BYTES,
        this.HASH_ALGO,
        (err, derivedKey) => {
          if (err) {
            reject(err);
          } else {
            resolve(derivedKey);
          }
        }
      );
    });
    return {
      key: derivedKeyBuffer.subarray(0, this.INNER_KEY_BYTES),
      iv: derivedKeyBuffer.subarray(-this.INNER_IV_BYTES)
    } as DerivedKeyAndIvObject;
  }

  public getDerivedKeyAndIvSync(password: string, salt: HexString): DerivedKeyAndIvObject {
    const derivedKeyBuffer = pbkdf2Sync(
      password,
      salt,
      this.INNER_KEY_ITERATIONS,
      this.INNER_KEY_BYTES + this.INNER_IV_BYTES,
      this.HASH_ALGO,
    );

    return {
      key: derivedKeyBuffer.subarray(0, this.INNER_KEY_BYTES),
      iv: derivedKeyBuffer.subarray(-this.INNER_IV_BYTES)
    } as DerivedKeyAndIvObject;
  }

  public async getDerivedKey(password: string, salt: HexString): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      pbkdf2(
        password,
        salt,
        this.INNER_KEY_ITERATIONS,
        this.INNER_KEY_BYTES,
        this.HASH_ALGO,
        (err, derivedKey) => {
          if (err) {
            reject(err);
          } else {
            resolve(derivedKey);
          }
        }
      );
    });
  }

  public getDerivedKeySync(password: string, salt: HexString): Buffer {
    return pbkdf2Sync(
      password,
      salt,
      this.INNER_KEY_ITERATIONS,
      this.INNER_KEY_BYTES,
      this.HASH_ALGO
    );
  }

  public async getEncryptedBuffer(value: Buffer, password: string, salt: HexString): Promise<SecureEncryptionResult> {
    const derivedKeyAndIv = await this.getDerivedKeyAndIv(password, salt);
    const encryptCipher = createCipheriv(
      this.INNER_CIPHER,
      derivedKeyAndIv.key,
      derivedKeyAndIv.iv,
    );
    const encryptedBuffer = Buffer.concat([
      encryptCipher.update(value),
      encryptCipher.final()
    ]);
    const authTag = encryptCipher.getAuthTag();
    return {
      result: encryptedBuffer,
      salt,
      iv: getHexStringFromBuffer(derivedKeyAndIv.iv),
      authTag: getHexStringFromBuffer(authTag)
    }
  }

  public getEncryptedBufferSync(value: Buffer, password: string, salt: HexString): SecureEncryptionResult {
    const derivedKeyAndIv = this.getDerivedKeyAndIvSync(password, salt);
    const encryptCipher = createCipheriv(
      this.INNER_CIPHER,
      derivedKeyAndIv.key,
      derivedKeyAndIv.iv,
    );
    const encryptedBuffer = Buffer.concat([
      encryptCipher.update(value),
      encryptCipher.final()
    ]);
    const authTag = encryptCipher.getAuthTag();
    return {
      result: encryptedBuffer,
      salt,
      iv: getHexStringFromBuffer(derivedKeyAndIv.iv),
      authTag: getHexStringFromBuffer(authTag),
    }
  }

  public async getEncryptedString(value: string, password: string, salt: HexString): Promise<SecureEncryptionResult> {
    const plainBuffer = getBufferFromUTF8String(value);
    return await this.getEncryptedBuffer(plainBuffer, password, salt);
  };

  public getEncryptedStringSync(value: string, password: string, salt: HexString): SecureEncryptionResult {
    const plainBuffer = getBufferFromUTF8String(value);
    return this.getEncryptedBufferSync(plainBuffer, password, salt);
  };

  public async getDecryptedBuffer(buffer: Buffer, password: string, salt: HexString, iv: HexString, authTag: HexString): Promise<Buffer> {
    const decryptCipher = createDecipheriv(
      this.INNER_CIPHER,
      await this.getDerivedKey(password, salt),
      getBufferFromHexString(iv),
    );
    decryptCipher.setAuthTag(getBufferFromHexString(authTag));
    return Buffer.concat([decryptCipher.update(buffer), decryptCipher.final()]);
  }

  public getDecryptedBufferSync(buffer: Buffer, password: string, salt: HexString, iv: HexString, authTag: HexString): Buffer {
    const decryptCipher = createDecipheriv(
      this.INNER_CIPHER,
      this.getDerivedKeySync(password, salt),
      getBufferFromHexString(iv),
    );
    decryptCipher.setAuthTag(getBufferFromHexString(authTag));
    return Buffer.concat([decryptCipher.update(buffer), decryptCipher.final()]);
  }

  public async getDecryptedString(value: HexString, password: string, salt: HexString, iv: HexString, authTag: HexString): Promise<string> {
    const decryptedBuffer = await this.getDecryptedBuffer(
      getBufferFromHexString(value),
      password,
      salt,
      iv,
      authTag,
    );
    return getUTF8StringFromBuffer(decryptedBuffer);
  };

  public getDecryptedStringSync(value: HexString, password: string, salt: HexString, iv: HexString, authTag: HexString): string {
    const decryptedBuffer = this.getDecryptedBufferSync(
      getBufferFromHexString(value),
      password,
      salt,
      iv,
      authTag,
    );
    return getUTF8StringFromBuffer(decryptedBuffer);
  };

  public async getPasswordEncryptedBuffer(value: Buffer, password: string): Promise<Buffer> {
    const derivedKey = await new Promise<Buffer>((resolve) => {
      const hash = createHash(this.HASH_ALGO);
      hash.update(this.OUTER_PEPPER + password);
      resolve(hash.digest());
    });
    return new Promise<Buffer>((resolve, reject) => {
      try {
        const cipher = createCipheriv(this.OUTER_CIPHER, derivedKey, ''); // empty iv intentional, this is not strong
        const encryptedBuffer = Buffer.concat([
            cipher.update(getBase64StringFromBuffer(value)),
            cipher.final()
        ]);
        resolve(encryptedBuffer);
      } catch (error) {
        reject(error);
      }
    });
  }

  public getPasswordEncryptedBufferSync(value: Buffer, password: string): Buffer {
    const derivedKey = createHash(this.HASH_ALGO).update(this.OUTER_PEPPER + password).digest();
    const cipher = createCipheriv(this.OUTER_CIPHER, derivedKey, ''); // empty iv intentional, this is not strong
    const encryptedBuffer = Buffer.concat([
      cipher.update(getBase64StringFromBuffer(value)),
      cipher.final()
    ]);
    return encryptedBuffer;
  }

  public async getPasswordEncryptedString(value: string, password: string): Promise<Buffer> {
    return await this.getPasswordEncryptedBuffer(
      getBufferFromUTF8String(value),
      password
    );
  }

  public getPasswordEncryptedStringSync(value: string, password: string): Buffer {
    return this.getPasswordEncryptedBufferSync(
      getBufferFromUTF8String(value),
      password
    );
  }

  public async getPasswordDecryptedBuffer(encryptedBuffer: Buffer, password: string): Promise<Buffer> {
    const derivedKey = createHash(this.HASH_ALGO).update(this.OUTER_PEPPER + password).digest();
    const decipher = createDecipheriv(this.OUTER_CIPHER, derivedKey, ''); // empty iv intentional, this is not strong
    const decryptedBuffer = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final()
    ]);
    return getBufferFromBase64String(getUTF8StringFromBuffer(decryptedBuffer));
  }

  public getPasswordDecryptedBufferSync(encryptedBuffer: Buffer, password: string): Buffer {
    const derivedKey = createHash(this.HASH_ALGO).update(this.OUTER_PEPPER + password).digest();
    const decipher = createDecipheriv(this.OUTER_CIPHER, derivedKey, ''); // empty iv intentional, this is not strong
    const decryptedBuffer = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final()
    ]);
    return getBufferFromBase64String(getUTF8StringFromBuffer(decryptedBuffer));
  }

  public async getPasswordDecryptedString(value: HexString, password: string): Promise<string> {
    const decryptedBuffer = await this.getPasswordDecryptedBuffer(
      getBufferFromHexString(value),
      password,
    );
    return getUTF8StringFromBuffer(decryptedBuffer);
  }

  public getPasswordDecryptedStringSync(value: HexString, password: string): string {
    const decryptedBuffer = this.getPasswordDecryptedBufferSync(
      getBufferFromHexString(value),
      password,
    );
    return getUTF8StringFromBuffer(decryptedBuffer);
  }

  public getMacSync(encryptedBuffer: Buffer, password: string): string | null {
    if (!(encryptedBuffer instanceof Buffer)) {
      return null;
    }

    try {
      const hmac = createHmac(this.MAC_ALGO, password);
      hmac.update(encryptedBuffer);
      return hmac.digest('hex');
    } catch (error) {
      return null;
    }
  }

  public createHash(algorithm: string, options?: HashOptions): Hash {
    return createHash(algorithm, options);
  }

  public createSign(algorithm: string, options?: WritableOptions): Sign {
    return createSign(algorithm, options);
  }

  public createVerify(algorithm: string, options?: WritableOptions): Verify {
    return createVerify(algorithm, options);
  }

  public generateKeyPair(options: RSAKeyPairOptionsPEM, callback: GenerateKeypairCallback): void {
    generateKeyPair('rsa', options, callback)
  }

  public createPublicKey(key: string): KeyObject {
    return createPublicKey(key);
  }

  public createPrivateKey(input: PrivateKeyInput): KeyObject {
    return createPrivateKey(input);
  };
}

export default CryptoCore;
