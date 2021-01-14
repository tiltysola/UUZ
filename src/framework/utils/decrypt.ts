/*
 * @Author: YoumuKonpaku
 * @Website: https://youmukonpaku.com
 * @Date: 2021-01-13 16:46:12
 * @LastEditTime: 2021-01-14 11:40:45
 */
import { createDecipheriv } from 'crypto';

const zeroPadding = (key: String) => {
  const keyByte = Buffer.from(key, 'utf-8');
  if (keyByte.length < 32) {
    const result = Buffer.alloc(32);
    Buffer.from(key, 'utf-8').copy(result);
    return result;
  }
  return keyByte;
};

const decryptRequest = (request: any, key: string) => {
  const encrypted = Buffer.from(request.encrypt, 'base64');
  const iv = encrypted.subarray(0, 16);
  const encryptedData = Buffer.from(encrypted.subarray(16, encrypted.length).toString(), 'base64');
  const decipher = createDecipheriv('aes-256-cbc', zeroPadding(key), iv);
  const decrypt = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
  const data = JSON.parse(decrypt.toString());
  return data;
};

export default decryptRequest;
