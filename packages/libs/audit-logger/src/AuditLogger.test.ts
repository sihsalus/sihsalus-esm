import 'fake-indexeddb/auto';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { clearKeyCache } from './crypto';
import { auditLogger } from './AuditLogger';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

vi.mock('@openmrs/esm-framework', () => ({
  openmrsFetch: vi.fn(),
}));

import { openmrsFetch } from '@openmrs/esm-framework';
const mockFetch = vi.mocked(openmrsFetch);

function okResponse() {
  return Promise.resolve({ ok: true, status: 200 });
}

function failResponse(status = 500) {
  return Promise.resolve({ ok: false, status });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DB = 'test-audit-logger';
const USER = 'user-uuid-1';
const SESSION = 'session-id-1';

function setupSession() {
  auditLogger.configure({ dbName: DB });
  auditLogger.setSession(USER, SESSION);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  auditLogger.clearSession();
  auditLogger.destroy();
  clearKeyCache();
  indexedDB.deleteDatabase(DB);
  // Reset rate-limit state by accessing a fresh session next test.
});

describe('log() — online path', () => {
  it('sends the event directly when online', async () => {
    mockFetch.mockResolvedValue(okResponse() as never);
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    setupSession();

    await auditLogger.log({ eventType: 'PATIENT_VIEW' });

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, opts] = mockFetch.mock.calls[0];
    expect(url).toBe('/ws/rest/v1/sihsalus/audit');
    expect(opts.method).toBe('POST');
    const body = opts.body as Array<{ eventType: string; userUuid: string; sessionId: string }>;
    expect(body[0].eventType).toBe('PATIENT_VIEW');
    expect(body[0].userUuid).toBe(USER);
    expect(body[0].sessionId).toBe(SESSION);
  });

  it('queues offline when the HTTP call fails', async () => {
    mockFetch.mockResolvedValue(failResponse() as never);
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    setupSession();

    await auditLogger.log({ eventType: 'PATIENT_VIEW' });

    // Flush should pick up the queued entry.
    mockFetch.mockResolvedValue(okResponse() as never);
    await auditLogger.flush();
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('log() — offline path', () => {
  it('queues the event and flushes on demand', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    setupSession();

    await auditLogger.log({ eventType: 'ENCOUNTER_VIEW' });
    expect(mockFetch).not.toHaveBeenCalled();

    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    mockFetch.mockResolvedValue(okResponse() as never);
    await auditLogger.flush();

    expect(mockFetch).toHaveBeenCalledOnce();
    const body = mockFetch.mock.calls[0][1].body as Array<{ eventType: string }>;
    expect(body[0].eventType).toBe('ENCOUNTER_VIEW');
  });
});

describe('log() — guards', () => {
  it('is a no-op when session is not set', async () => {
    auditLogger.configure({ dbName: DB });
    // No setSession call.
    await auditLogger.log({ eventType: 'PATIENT_VIEW' });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('drops events after rate limit is exceeded', async () => {
    mockFetch.mockResolvedValue(okResponse() as never);
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    setupSession();

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    // Send 21 events — first 20 succeed, 21st is dropped.
    for (let i = 0; i < 21; i++) {
      await auditLogger.log({ eventType: 'PING' });
    }
    expect(mockFetch).toHaveBeenCalledTimes(20);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Rate limit'),
      expect.any(String),
    );
    warnSpy.mockRestore();
  });
});

describe('flush()', () => {
  it('is a no-op when session is not set', async () => {
    auditLogger.configure({ dbName: DB });
    // No setSession — flush should not attempt to read/decrypt.
    await auditLogger.flush();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('sends entries in batches and clears them on success', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    setupSession();

    // Queue 55 events (> FLUSH_BATCH_SIZE of 50).
    for (let i = 0; i < 55; i++) {
      await auditLogger.log({ eventType: `EVT_${i}` });
    }

    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    mockFetch.mockResolvedValue(okResponse() as never);
    await auditLogger.flush();

    // Expect 2 POST calls (batch of 50 + batch of 5).
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // After a successful flush the queue should be empty.
    mockFetch.mockClear();
    await auditLogger.flush();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('stops flushing on first batch failure and keeps remaining entries', async () => {
    Object.defineProperty(navigator, 'onLine', { value: false, configurable: true });
    setupSession();
    for (let i = 0; i < 3; i++) {
      await auditLogger.log({ eventType: 'EVT' });
    }

    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    mockFetch.mockResolvedValue(failResponse() as never);
    await auditLogger.flush();

    // Entries must still be in the queue.
    mockFetch.mockResolvedValue(okResponse() as never);
    await auditLogger.flush();
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});

describe('clearSession()', () => {
  it('prevents subsequent log() calls from sending events', async () => {
    mockFetch.mockResolvedValue(okResponse() as never);
    Object.defineProperty(navigator, 'onLine', { value: true, configurable: true });
    setupSession();

    await auditLogger.log({ eventType: 'BEFORE_LOGOUT' });
    auditLogger.clearSession();
    await auditLogger.log({ eventType: 'AFTER_LOGOUT' });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const body = mockFetch.mock.calls[0][1].body as Array<{ eventType: string }>;
    expect(body[0].eventType).toBe('BEFORE_LOGOUT');
  });
});

describe('configure() — endpoint validation', () => {
  it('accepts a relative path', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    auditLogger.configure({ endpoint: '/ws/rest/v1/custom/audit' });
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('rejects an external URL and keeps the previous endpoint', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    auditLogger.configure({ endpoint: '/ws/rest/v1/sihsalus/audit' });
    auditLogger.configure({ endpoint: 'https://evil.example.com/exfil' });
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Rejected unsafe endpoint'),
      expect.any(String),
    );
    errorSpy.mockRestore();
  });
});

describe('init() / destroy()', () => {
  it('init() is idempotent — registers only one online listener', async () => {
    const addSpy = vi.spyOn(globalThis, 'addEventListener');
    setupSession();
    auditLogger.init();
    auditLogger.init();
    auditLogger.init();
    const onlineListeners = addSpy.mock.calls.filter(([event]) => event === 'online');
    expect(onlineListeners).toHaveLength(1);
    addSpy.mockRestore();
    auditLogger.destroy();
  });
});
