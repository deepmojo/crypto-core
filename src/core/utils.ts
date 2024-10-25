import { HexString, UTF8String } from "../types";

// Hex

export function getHexStringFromBuffer(buffer: Buffer): HexString {
  return buffer.toString('hex');
}

// Utf8

export function getUTF8StringFromBuffer(buffer: Buffer): UTF8String {
  return buffer.toString('utf8');
}

// Buffers

export function getBufferFromHexString(value: HexString): Buffer {
  return Buffer.from(value, 'hex');
}

export function getBufferFromUTF8String(value: UTF8String): Buffer {
  return Buffer.from(value, 'utf8');
}

export function getBufferFromBase64String(value: UTF8String): Buffer {
  return Buffer.from(value, 'base64');
}

export function getBufferFromBase64UrlString(value: UTF8String): Buffer {
  return Buffer.from(value, 'base64url');
}

// Base 64

export function getBase64StringFromBuffer(buffer: Buffer): UTF8String {
  return buffer.toString('base64');
}

export function getBase64UrlStringFromBuffer(buffer: Buffer): UTF8String {
  return buffer.toString('base64url');
}
