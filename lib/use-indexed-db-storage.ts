import { useMemo } from "react";
import { UseStorageFn } from "./types";
import { useStorage } from "./use-storage";
import { createIndexedDBStorage } from "./indexed-db";

/**
 * Hook for using IndexedDB storage with React
 * @param key - The storage key
 * @param initialValue - Optional initial value
 * @param dbName - Optional database name (defaults to "AppStorage")
 * @param storeName - Optional store name (defaults to "keyval")
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
