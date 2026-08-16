const IV_LENGTH = 12;
const KEY_LENGTH = 32;

export type EncryptedValue = {
  ciphertext: string;
  iv: string;
  encryptionVersion: number;
};

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function base64ToBytes(value: string) {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function importKey(encodedKey: string) {
  const keyBytes = base64ToBytes(encodedKey);

  if (keyBytes.byteLength !== KEY_LENGTH) {
    throw new Error("The encryption key must contain 32 bytes");
  }

  return crypto.subtle.importKey("raw", keyBytes, "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function encryptText(
  plaintext: string,
  encodedKey: string,
  encryptionVersion: number,
): Promise<EncryptedValue> {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await importKey(encodedKey);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plaintext),
  );

  return {
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
    iv: bytesToBase64(iv),
    encryptionVersion,
  };
}

export async function decryptText(value: EncryptedValue, encodedKey: string) {
  const key = await importKey(encodedKey);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBytes(value.iv) },
    key,
    base64ToBytes(value.ciphertext),
  );

  return new TextDecoder().decode(plaintext);
}
