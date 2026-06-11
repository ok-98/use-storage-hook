import { Dispatch, SetStateAction } from "react";
import { StorageKey, StorageParser, StorageValue } from "./types";
import { useStorage } from "./use-storage";

/**
 * React hook for persisting state in any custom `Storage`-compatible backend.
 *
 * Use this when `useLocalStorage` / `useSessionStorage` don't fit — e.g. a
 * third-party adapter, an in-memory store, or `IndexedDBStorage`.
 *
 * @param storageName - Unique name for the storage (must end in `"Storage"`).
 * @param storage - A `Storage`-compatible object to read/write from.
 * @param key - The key under which the value is stored.
 * @param initialValue - Optional initial value used when no stored value exists.
 * @param parser - Optional custom serialize/deserialize pair.
 *   Defaults to `JSON.stringify` / `JSON.parse`.
 * @returns A tuple of `[value, setValue, removeValue]`.
 *   - `value` — current stored value (or `initialValue` / `undefined`).
 *   - `setValue` — setter, same signature as `React.useState`.
 *   - `removeValue` — removes the entry from storage and resets to `undefined`.
 *
 * @example
 * const myStore = new MyCustomStorage();
 * const [val, setVal] = useCustomStorage<string>("myStorage", myStore, "key", "default");
 */
export const useCustomStorage: UseCustomStorageFn = (<T>(
  storageName: StorageKey,
  storage: Exclude<StorageValue, "ssr">,
  key: string,
  initialValue?: T,
  parser?: StorageParser<T>
) => {
  return useStorage<T>(storageName, storage, key, initialValue, parser);
}) as UseCustomStorageFn;

type UseCustomStorageFnNullable = <T>(
  storageName: StorageKey,
  storage: Exclude<StorageValue, "ssr">,
  key: string,
  initialValue?: undefined,
  parser?: StorageParser<T>
) => [T | undefined, Dispatch<SetStateAction<T>>, () => void];

type UseCustomStorageFnNonNullable = <T>(
  storageName: StorageKey,
  storage: Exclude<StorageValue, "ssr">,
  key: string,
  initialValue: T,
  parser?: StorageParser<T>
) => [T, Dispatch<SetStateAction<T>>, () => void];

export type UseCustomStorageFn = UseCustomStorageFnNullable &
  UseCustomStorageFnNonNullable;
