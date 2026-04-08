import type { StoredAuditEntry } from './types';

const STORE_NAME = 'entries';

function openDb(dbName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Failed to open IndexedDB'));
  });
}

export async function putEntry(dbName: string, entry: StoredAuditEntry): Promise<void> {
  const db = await openDb(dbName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(entry);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to put entry in IndexedDB'));
  });
}

export async function getAllEntries(dbName: string): Promise<StoredAuditEntry[]> {
  const db = await openDb(dbName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result as StoredAuditEntry[]);
    req.onerror = () => reject(req.error ?? new Error('Failed to get all entries from IndexedDB'));
  });
}

export async function clearEntries(dbName: string, ids: string[]): Promise<void> {
  const db = await openDb(dbName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    ids.forEach((id) => store.delete(id));
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error('Failed to clear entries from IndexedDB'));
  });
}

export async function countEntries(dbName: string): Promise<number> {
  const db = await openDb(dbName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error('Failed to count entries in IndexedDB'));
  });
}

export async function deleteOldestEntries(dbName: string, keepCount: number): Promise<void> {
  const all = await getAllEntries(dbName);
  if (all.length <= keepCount) return;
  const toDelete = all
    .toSorted((a, b) => a.timestamp.localeCompare(b.timestamp))
    .slice(0, all.length - keepCount)
    .map((e) => e.id);
  await clearEntries(dbName, toDelete);
}
