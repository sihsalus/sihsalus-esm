/**
 * AES-GCM 256-bit encryption for audit entries stored in IndexedDB.
 *
 * Key derivation (v2): HKDF-SHA-256 over (UUID bytes ∥ per-device random salt).
 *
 * Threat model for a rural-clinic, shared-device context:
 *   - Physical device theft: attacker who extracts the raw IndexedDB file from
 *     the filesystem cannot decrypt without also knowing the random device salt,
 *     which lives in localStorage under a separate storage key. Getting both
 *     requires full browser-profile access.
 *   - Cross-user snooping on the same device: different UUIDs → different salts
 *     → independent keys; one user cannot read another's offline queue.
 *   - XSS: an XSS script that can call crypto.subtle can still read localStorage
 *     and reconstruct the key. Mitigate with a strict Content-Security-Policy —
 *     this layer is not a substitute for CSP.
 *
 * The per-device salt is generated on first use and persisted in localStorage.
 * It survives page refreshes (required for offline-queue flushing) but is
 * intentionally not stored inside IndexedDB alongside the ciphertext.
 *
 * Migration note: entries encrypted with the old UUID-only key (pre-v2 salt)
 * will fail AES-GCM authentication and be silently dropped, consistent with
 * the existing behaviour for corrupted/wrong-key payloads.
 */

const ALGO = 'AES-GCM';
const KEY_LEN = 256;
const IV_LEN = 12; // 96-bit IV recommended for GCM
const DEVICE_SALT_LEN = 32; // 256 bits of per-device entropy
const DEVICE_SALT_PREFIX = 'sihsalus-audit-salt-v2-';

const SALT = new TextEncoder().encode('sihsalus-audit-v2');
const INFO = new TextEncoder().encode('audit-log-encryption');

// Avoid re-deriving the same key on every operation within a session.
const keyCache = new Map<string, CryptoKey>();

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function toBase64(bytes: Uint8Array): string {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

function fromBase64(b64: string): Uint8Array {
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
}

/**
 * Returns the per-device-per-user salt, generating and persisting it on first
 * use. Uses `globalThis.localStorage` so the call is safe in test environments
 * where localStorage may be a mock or may not persist.
 */
function loadOrCreateDeviceSalt(userUuid: string): Uint8Array {
  const storageKey = `${DEVICE_SALT_PREFIX}${userUuid}`;
  const stored = globalThis.localStorage?.getItem(storageKey);
  if (stored) {
    try {
      const salt = fromBase64(stored);
      if (salt.length === DEVICE_SALT_LEN) return salt;
      // Wrong length (e.g. corrupted entry) — regenerate below.
    } catch {
      // Corrupted base64 — regenerate below.
    }
  }
  const salt = crypto.getRandomValues(new Uint8Array(DEVICE_SALT_LEN));
  globalThis.localStorage?.setItem(storageKey, toBase64(salt));
  return salt;
}

// ---------------------------------------------------------------------------
// Key derivation
// ---------------------------------------------------------------------------

async function getKey(userUuid: string): Promise<CryptoKey> {
  const hit = keyCache.get(userUuid);
  if (hit) return hit;

  // Combine UUID bytes with the random per-device salt.
  // Neither value alone is sufficient to reconstruct the key.
  const deviceSalt = loadOrCreateDeviceSalt(userUuid);
  const uuidBytes = new TextEncoder().encode(userUuid);
  const keyMaterial = new Uint8Array(uuidBytes.length + deviceSalt.length);
  keyMaterial.set(uuidBytes);
  keyMaterial.set(deviceSalt, uuidBytes.length);

  const raw = await crypto.subtle.importKey('raw', keyMaterial, 'HKDF', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: SALT, info: INFO },
    raw,
    { name: ALGO, length: KEY_LEN },
    false,
    ['encrypt', 'decrypt'],
  );
  keyCache.set(userUuid, key);
  return key;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Encrypt arbitrary JSON-serialisable data. Returns a base64 blob: IV ∥ ciphertext. */
export async function encryptPayload(data: unknown, userUuid: string): Promise<string> {
  const key = await getKey(userUuid);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
  const plain = new TextEncoder().encode(JSON.stringify(data));
  const cipher = await crypto.subtle.encrypt({ name: ALGO, iv }, key, plain);

  const combined = new Uint8Array(IV_LEN + cipher.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(cipher), IV_LEN);
  return toBase64(combined);
}

/**
 * Decrypt a payload produced by {@link encryptPayload}.
 * Returns `null` if decryption fails (wrong key, corrupted data, or an entry
 * encrypted before the per-device salt was introduced).
 * Never throws.
 */
export async function decryptPayload<T>(payload: string, userUuid: string): Promise<T | null> {
  try {
    const key = await getKey(userUuid);
    const combined = fromBase64(payload);
    const iv = combined.slice(0, IV_LEN);
    const cipher = combined.slice(IV_LEN);
    const plain = await crypto.subtle.decrypt({ name: ALGO, iv }, key, cipher);
    return JSON.parse(new TextDecoder().decode(plain)) as T;
  } catch {
    return null;
  }
}

/** Release cached keys from memory (call on logout). */
export function clearKeyCache(): void {
  keyCache.clear();
}
