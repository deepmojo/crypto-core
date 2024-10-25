# DeepMojo Crypto-Core [![Jest Test Suite Badge](https://github.com/deepmojo/crypto-core/actions/workflows/jest.yml/badge.svg)](https://github.com/deepmojo/crypto-core/actions/workflows/jest.yml)

> ⚠️ **SECURITY NOTICE** ⚠️
>
> This library has not undergone extensive production testing or security auditing. Use in production environments is not recommended at this time. For research and development purposes only.

## Overview

[**DeepMojo Crypto-Core**](https://github.com/deepmojo/crypto-core) is a robust TypeScript cryptography library designed for Node.js and Electron environments. It provides a streamlined interface to cryptographic operations with secure defaults, built on top of the battle-tested [node:crypto](https://github.com/nodejs/node/tree/main/src/crypto) module.

### Key Features

- 🔒 Comprehensive toolkit of major cryptographic operations
  - 🔢 **RNG & Key Derivation** - Secure random number generation and key derivation functions with industry-standard algorithms.
  - 🧠 **World-Class Encryption/Decryption** - AES-GCM-256 encryption with authenticated encryption support.
  - ✳ **Password-Only Encryption/Decryption** - Simplified APIs for password-only encryption scenarios.
  - 🧮 **Cryptographic Utilities** - Including hashing and digital signatures capabilities.
  - 🗝️ **Key Management** - Public/private key pair generation and management utilities.
- 🚀 Both synchronous and asynchronous APIs
- 💪 Strong default security parameters
- 🧪 Comprehensive test coverage with Jest
- 🔍 TypeScript-first development

## Project Status

| Objective | Status | Description |
|-----------|--------|-------------|
| **Cross-Platform Support** | ✅ 100% | Full compatibility across Windows, macOS, and Linux |
| **Security-First Design** | ✅ 100% | Enforces secure defaults with simplified developer experience |
| **Security Best Practices** | 🚧 66% | Pending: GHSA integration |


## Installation

```bash
npm install @deepmojo/crypto-core

# or for yarn

yarn add @deepmojo/crypto-core
```

## Build

npm run build or yarn build: Compiles the TypeScript code using the tsconfig.json configuration file. This script is used to build the project and prepare it for distribution.

## Test

`npm run test` or `yarn test`: Runs the Jest test suite with verbose output and code coverage reporting. This script is used to test the project and ensure that it is working as expected.

## Usage

Here's an example of how to use the CryptoCore library to encrypt and decrypt a string:

```typescript
import CryptoCore, { CryptoCoreOptions, getUTF8StringFromBuffer } from "@deepmojo/crypto-core";

const options: CryptoCoreOptions = {
  OUTER_PEPPER: 'pepper is yum',
  INNER_KEY_ITERATIONS: 100,
};

let cryptoCore: CryptoCore;

beforeAll(() => {
  cryptoCore = new CryptoCore(options);
});

const salt = cryptoCore.getRandomSalt();

// Encrypt
const encryptResult = cryptoCore.getEncryptedStringSync('Hello, World!', 'secret password', salt);

// Decrypt
const decryptedString = cryptoCore.getDecryptedStringSync(
  getHexStringFromBuffer(encryptResult.result),
  password,
  salt,
  encryptResult.iv,
  encryptResult.authTag
);
```

For more examples and usage scenarios, please refer to the tests in the `src/tests` directory.

## Future Research

- Chromium SafeStorage API wrapper
- OTP/TOTP/Authenticator
- Pin/pattern hashing and verification
- JWE/JWK authentication
- Windows Credential Locker
- HSM, TPM, PAM, MFA, 2FA
- Hardware security: FIDO U2F, WebAuthn/FIDO2, TrustKey, Yubikey
- macOS Secure Enclave integration

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## Security

For security concerns, please review our [Security Policy](SECURITY.md).

## License

[MIT](LICENSE)

---

*This project adheres to [Semantic Versioning](https://semver.org/).*
