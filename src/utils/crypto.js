import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = '3F4428472B4B6250655368566D597133';

function getSecretKey() {
  return CryptoJS.SHA256(ENCRYPTION_KEY);
}

function generateIV() {
  return CryptoJS.lib.WordArray.random(16);
}

export function aesEncrypt(plainText) {
  const key = getSecretKey();
  const iv = generateIV();

  const encrypted = CryptoJS.AES.encrypt(
    plainText,
    key,
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  const ivHex = iv.toString(CryptoJS.enc.Hex).toUpperCase();

  const cipherHex = encrypted.ciphertext
    .toString(CryptoJS.enc.Hex)
    .toUpperCase();

  return `${ivHex}:${cipherHex}`;
}

export function aesDecrypt(encryptedText) {
  const [ivHex, cipherHex] = encryptedText.split(':');

  const key = getSecretKey();

  const iv = CryptoJS.enc.Hex.parse(ivHex);

  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Hex.parse(cipherHex),
  });

  const decrypted = CryptoJS.AES.decrypt(
    cipherParams,
    key,
    {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
}