import { useMemo } from "react";
import { UseStorageFn } from "./types";
import { useStorage } from "./use-storage";
import { createIndexedDBStorage } from "./indexed-db";

/**
 * (Experimental) React hook for persisting state in IndexedDB.
 *
 * Backed by `IndexedDBStorage`, which mirrors the `Storage` interface so it
 * works synchronously via an in-memory cache and flushes writes to IndexedDB
 * asynchronously. Values survive across sessions and are not subject to the
 * ~5 MB size limit of `localStorage`.
 *
 * @param key - The key under which the value is stored.
 * @param initialValue - Optional initial value used when no stored value exists.
 * @param dbName - IndexedDB database name (defaults to `"AppStorage"`).
 * @param storeName - Object store name within the database (defaults to `"keyval"`).
 * @returns A tuple of `[value, setValue, removeValue]`.
 *   - `value` — current stored value (or `initialValue` / `undefined`).
 *   - `setValue` — setter, same signature as `React.useState`.
 *   - `removeValue` — removes the entry from storage and resets to `undefined`.
 *
 * @example
 * const [blob, setBlob, clearBlob] = useIndexedDBStorage<ArrayBuffer>("avatar");
 */
export const useIndexedDBStorage = (<T>(
  key: string,
  initialValue?: T,
  dbName?: string,
  storeName?: string
) => {
  const storage = useMemo(
    () => createIndexedDBStorage(dbName, storeName),
    [dbName, storeName]
  );
  const parser = useMemo(
    () => ({
      parse: (value: string) => value as unknown as T,
      stringify: (value: T | undefined) => value as unknown as string,
    }),
    []
  );
  return useStorage<T>("indexedDBStorage", storage, key, initialValue, parser);
}) as UseStorageFn;
