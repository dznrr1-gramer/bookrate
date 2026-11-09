import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const keyLength = 64;
const cost = 16_384;
const blockSize = 8;
const parallelization = 1;

async function deriveKey(password: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password,
      salt,
      keyLength,
      {
        N: cost,
        r: blockSize,
        p: parallelization,
        maxmem: 64 * 1024 * 1024,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(derivedKey);
      },
    );
  });
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const derivedKey = await deriveKey(password, salt);
  return `scrypt$${cost}$${blockSize}$${parallelization}$${salt}$${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  const [
    algorithm,
    storedCost,
    storedBlockSize,
    storedParallelization,
    salt,
    encodedKey,
  ] = storedHash.split("$");
  if (
    algorithm !== "scrypt" ||
    storedCost !== String(cost) ||
    storedBlockSize !== String(blockSize) ||
    storedParallelization !== String(parallelization) ||
    !salt ||
    !encodedKey
  ) {
    return false;
  }

  const expectedKey = Buffer.from(encodedKey, "base64url");
  if (expectedKey.length !== keyLength) {
    return false;
  }

  const actualKey = await deriveKey(password, salt);
  return timingSafeEqual(actualKey, expectedKey);
}
