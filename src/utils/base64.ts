import { getBase64StringFromBuffer, getBase64UrlStringFromBuffer, getBufferFromBase64String, getBufferFromBase64UrlString, getBufferFromUTF8String, getUTF8StringFromBuffer } from "../core/utils";
import { UTF8String } from "../types";

export function base64Encode(value: string): UTF8String {
  return getBase64StringFromBuffer(getBufferFromUTF8String(value));
}

export function base64Decode(value: string): UTF8String {
  return getUTF8StringFromBuffer(getBufferFromBase64String(value));
}

// replaces the + and / characters with - and _
export function base64UrlEncode(value: string): UTF8String {
  return getBase64UrlStringFromBuffer(getBufferFromUTF8String(value));
}

// replaces the + and / characters with - and _
export function base64UrlDecode(value: string): UTF8String {
  return getUTF8StringFromBuffer(getBufferFromBase64UrlString(value));
}
