/**
 * `Storage`-compatible class backed by IndexedDB.
 *
 * All reads are served from an in-memory cache populated at construction time,
 * so `getItem` / `key` / `length` are synchronous. Writes (`setItem`,
 * `removeItem`, `clear`) update the cache immediately and flush to IndexedDB
 * asynchronously.
 *
 * @example
 * const store = new IndexedDBStorage("MyApp", "settings");
 * store.setItem("theme", "dark");
 * store.getItem("theme"); // "dark"
 */
export class IndexedDBStorage implements Storage {
  private dbName: string;
  private storeName: string;
  private dbPromise: Promise<IDBDatabase> | null = null;
  private cache: Map<string, string> = new Map();

  constructor(dbName: string = "AppStorage", storeName: string = "keyval") {
    this.dbName = dbName;
    this.storeName = storeName;
    this.initDB();
  }

  private async initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise;
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

    return this.dbPromise;
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
    this.initDB().then((db) => {
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
    this.initDB().then((db) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      store.delete(key);
    });
  }

  setItem(key: string, value: string): void {
    this.cache.set(key, value);
    this.initDB().then((db) => {
      const transaction = db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      store.put(value, key);
    });
  }
}

/**
 * Factory for `IndexedDBStorage`.
 *
 * Prefer this over calling `new IndexedDBStorage()` directly when the database
 * name or store name may be `undefined` — it passes them through so the class
 * defaults apply.
 *
 * @param dbName - IndexedDB database name (defaults to `"AppStorage"`).
 * @param storeName - Object store name within the database (defaults to `"keyval"`).
 * @returns A new `IndexedDBStorage` instance.
 */
export const createIndexedDBStorage = (
  dbName?: string,
  storeName?: string
): IndexedDBStorage => {
  return new IndexedDBStorage(dbName, storeName);
};
