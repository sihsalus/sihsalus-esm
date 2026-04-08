import { openmrsFetch } from '@openmrs/esm-framework';

import { clearEntries, countEntries, deleteOldestEntries, getAllEntries, putEntry } from './db';
import type { AuditEvent, AuditLoggerConfig, StoredAuditEntry } from './types';

const DEFAULTS: Required<AuditLoggerConfig> = {
  endpoint: '/ws/rest/v1/sihsalus/audit',
  dbName: 'sihsalus-audit-log',
  maxOfflineEntries: 500,
};

const FLUSH_BATCH_SIZE = 50;

class AuditLogger {
  private config: Required<AuditLoggerConfig> = { ...DEFAULTS };
  private sessionRef: { userUuid: string; sessionId: string } | null = null;
  private onlineHandler: (() => void) | null = null;

  configure(config: Partial<AuditLoggerConfig>): void {
    this.config = { ...DEFAULTS, ...config };
  }

  setSession(userUuid: string, sessionId: string): void {
    this.sessionRef = { userUuid, sessionId };
  }

  init(): void {
    this.onlineHandler = () => {
      this.flush().catch(() => {});
    };
    globalThis.addEventListener('online', this.onlineHandler);
    if (navigator.onLine) {
      this.flush().catch(() => {});
    }
  }

  destroy(): void {
    if (this.onlineHandler) {
      globalThis.removeEventListener('online', this.onlineHandler);
      this.onlineHandler = null;
    }
  }

  log(event: Omit<AuditEvent, 'timestamp' | 'userUuid' | 'sessionId'>): void {
    if (!this.sessionRef) return;

    const entry: StoredAuditEntry = {
      ...event,
      timestamp: new Date().toISOString(),
      userUuid: this.sessionRef.userUuid,
      sessionId: this.sessionRef.sessionId,
      id: crypto.randomUUID(),
    };

    if (navigator.onLine) {
      this.sendEntries([entry]).catch(() => {
        this.queueEntry(entry).catch(() => {});
      });
    } else {
      this.queueEntry(entry).catch(() => {});
    }
  }

  async flush(): Promise<void> {
    const { dbName } = this.config;
    const entries = await getAllEntries(dbName);
    if (!entries.length) return;

    for (let i = 0; i < entries.length; i += FLUSH_BATCH_SIZE) {
      const batch = entries.slice(i, i + FLUSH_BATCH_SIZE);
      try {
        await this.sendEntries(batch);
        await clearEntries(dbName, batch.map((e) => e.id));
      } catch {
        break;
      }
    }
  }

  private async queueEntry(entry: StoredAuditEntry): Promise<void> {
    const { dbName, maxOfflineEntries } = this.config;
    const count = await countEntries(dbName);
    if (count >= maxOfflineEntries) {
      await deleteOldestEntries(dbName, maxOfflineEntries - 1);
    }
    await putEntry(dbName, entry);
  }

  private async sendEntries(entries: StoredAuditEntry[]): Promise<void> {
    const response = await openmrsFetch(this.config.endpoint, {
      method: 'POST',
      body: entries,
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Audit flush failed: ${response.status}`);
    }
  }
}

export const auditLogger = new AuditLogger();
