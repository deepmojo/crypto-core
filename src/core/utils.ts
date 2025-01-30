export function getBase64StringFromBuffer(buffer: Buffer): string {
  return buffer.toString('base64');
}

export function getHexStringFromBuffer(buffer: Buffer): string {
  return buffer.toString('hex');
}

export function getUTF8StringFromBuffer(buffer: Buffer): string {
  return buffer.toString('utf8');
}

export function getBufferFromBase64String(value: string): Buffer {
  return Buffer.from(value, 'base64');
}

export function getBufferFromHexString(value: string): Buffer {
  return Buffer.from(value, 'hex');
}

export function getBufferFromUTF8String(value: string): Buffer {
  return Buffer.from(value, 'utf8');
}
