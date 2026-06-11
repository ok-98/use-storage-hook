import { baseStorages, UseStorageFn } from "./types";
import { useStorage } from "./use-storage";

/**
 * React hook for persisting state in `localStorage`.
 *
 * @param key - The key under which the value is stored.
 * @param initialValue - Optional initial value used when no stored value exists.
 * @returns A tuple of `[value, setValue, removeValue]`.
 *   - `value` — current stored value (or `initialValue` / `undefined`).
 *   - `setValue` — setter, same signature as `React.useState`.
 *   - `removeValue` — removes the entry from storage and resets to `undefined`.
 *
 * @example
 * const [token, setToken, removeToken] = useLocalStorage<string>("auth-token");
 */
export const useLocalStorage: UseStorageFn = (<T>(
  key: string,
  initialValue?: T
) => {
  return useStorage<T>(
    "localStorage",
    baseStorages.localStorage,
    key,
    initialValue
  );
}) as UseStorageFn;
