/**
 * IndexedDB-backed Storage implementation
 * Implements the Storage interface using IndexedDB as the underlying storage mechanism
 */
export class IndexedDBStorage implements Storage {
  private dbName: string;
  private storeName: string;
  private dbPromise: Promise<IDBDatabase> | null = null;
  private cache: Map<string, string> = new Map();
  private initialized = false;

  constructor(dbName: string = "AppStorage", storeName: string = "keyval") {
    this.dbName = dbName;
    this.storeName = storeName;
    this.initDB();
  }

  private async initDB(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });

    // Populate cache on initialization
    const db = await this.dbPromise;
    await this.populateCache(db);
    this.initialized = true;
  }

  private async populateCache(db: IDBDatabase): Promise<void> {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          this.cache.set(cursor.key as string, cursor.value);
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  get length(): number {
    return this.cache.size;
  }

  clear(): void {
    this.cache.clear();
    this.getDB().then((db) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      store.clear();
    });
  }

  getItem(key: string): string | null {
    return this.cache.get(key) ?? null;
  }

  key(index: number): string | null {
    const keys = Array.from(this.cache.keys());
    return keys[index] ?? null;
  }

  removeItem(key: string): void {
    this.cache.delete(key);
    this.getDB().then((db) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      store.delete(key);
    });
  }

  setItem(key: string, value: string): void {
    this.cache.set(key, value);
    this.getDB().then((db) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      store.put(value, key);
    });
  }

  private async getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise;
    }
    await this.initDB();
    return this.dbPromise!;
  }
}

// Singleton instances to ensure cache persistence
const storageInstances = new Map<string, IndexedDBStorage>();

/**
 * Creates an IndexedDB storage instance
 * Returns "ssr" if running in a server-side environment
 * Uses singleton pattern to ensure cache consistency
 */
export const createIndexedDBStorage = (
  dbName: string = "AppStorage",
  storeName: string = "keyval"
): IndexedDBStorage | "ssr" => {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") {
    return "ssr";
  }

  const key = `${dbName}:${storeName}`;
  if (!storageInstances.has(key)) {
    storageInstances.set(key, new IndexedDBStorage(dbName, storeName));
  }

  return storageInstances.get(key)!;
};
