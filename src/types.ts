
// String Aliases

export type HexString = string;
export type UTF8String = string;

// Options

export type CryptoCoreOptions = {
  OUTER_PEPPER: string;
  INNER_KEY_ITERATIONS: number;
};

// Algorithms

export type SHA_256 = 'sha256';
export type AES_256_ECB = 'aes-256-ecb';
export type AES_256_GCM = 'aes-256-gcm';

// Inner Security Types

export type SecureEncryptionResult = {
  result: Buffer;
  salt: HexString;
  iv: HexString;
  authTag: HexString;
}

export type DerivedKeyAndIvObject = {
  key: Buffer;
  iv: Buffer;
};
