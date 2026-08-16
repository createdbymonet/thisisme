const HASH_ALGORITHM = "PBKDF2";
const HASH_DIGEST = "SHA-256";
const HASH_ITERATIONS = 100_000;
const SALT_LENGTH = 16;
const HASH_LENGTH = 32;
const FORMAT_PREFIX = "pbkdf2-sha256";

function bytesToBase64Url(bytes: Uint8Array) {
  return bytesToBase64(bytes).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

export function createAccessCode() {
  return bytesToBase64Url(crypto.getRandomValues(new Uint8Array(24)));
}

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

async function deriveHash(accessCode: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(accessCode),
    HASH_ALGORITHM,
    false,
    ["deriveBits"],
  );

  return new Uint8Array(await crypto.subtle.deriveBits({
    name: HASH_ALGORITHM,
    hash: HASH_DIGEST,
    salt,
    iterations,
  }, key, HASH_LENGTH * 8));
}

export async function hashAccessCode(accessCode: string) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const hash = await deriveHash(accessCode, salt, HASH_ITERATIONS);
  return `${FORMAT_PREFIX}$${HASH_ITERATIONS}$${bytesToBase64(salt)}$${bytesToBase64(hash)}`;
}

export async function verifyAccessCode(accessCode: string, storedHash: string) {
  const [prefix, iterationsValue, saltValue, hashValue] = storedHash.split("$");
  const iterations = Number(iterationsValue);

  if (
    prefix !== FORMAT_PREFIX
    || !Number.isSafeInteger(iterations)
    || iterations < 100_000
    || iterations > 1_000_000
    || !saltValue
    || !hashValue
  ) {
    return false;
  }

  try {
    const expectedHash = base64ToBytes(hashValue);
    const actualHash = await deriveHash(accessCode, base64ToBytes(saltValue), iterations);
    return expectedHash.byteLength === actualHash.byteLength
      && crypto.subtle.timingSafeEqual(expectedHash, actualHash);
  } catch {
    return false;
  }
}
