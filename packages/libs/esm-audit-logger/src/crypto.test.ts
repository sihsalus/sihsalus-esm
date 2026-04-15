import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { clearKeyCache, decryptPayload, encryptPayload } from './crypto';

describe('crypto', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => clearKeyCache());

  describe('encryptPayload / decryptPayload', () => {
    it('roundtrips arbitrary data', async () => {
      const data = { sessionId: 'sess-123', patientUuid: 'pt-abc', metadata: { ward: 'ICU' } };
      const payload = await encryptPayload(data, 'user-uuid-1');
      const result = await decryptPayload(payload, 'user-uuid-1');
      expect(result).toEqual(data);
    });

    it('produces different ciphertext each call (random IV)', async () => {
      const data = { eventType: 'VIEW' };
      const p1 = await encryptPayload(data, 'user-uuid-1');
      const p2 = await encryptPayload(data, 'user-uuid-1');
      expect(p1).not.toBe(p2);
    });

    it('returns null when decrypting with a different user key', async () => {
      const payload = await encryptPayload({ secret: true }, 'user-uuid-1');
      const result = await decryptPayload(payload, 'user-uuid-2');
      expect(result).toBeNull();
    });

    it('returns null for corrupted ciphertext', async () => {
      const result = await decryptPayload('not-valid-base64!!!', 'user-uuid-1');
      expect(result).toBeNull();
    });

    it('returns null for a truncated payload (no IV)', async () => {
      const result = await decryptPayload(btoa('short'), 'user-uuid-1');
      expect(result).toBeNull();
    });
  });

  describe('clearKeyCache', () => {
    it('forces key re-derivation (same output for same input)', async () => {
      const payload1 = await encryptPayload({ x: 1 }, 'user-uuid-1');
      clearKeyCache();
      // After clearing, a fresh key is derived — it must be the same key
      // (deterministic HKDF), so decryption still succeeds.
      const result = await decryptPayload(payload1, 'user-uuid-1');
      expect(result).toEqual({ x: 1 });
    });
  });
});
