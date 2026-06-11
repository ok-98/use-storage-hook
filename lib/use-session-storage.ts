import { baseStorages, UseStorageFn } from "./types";
import { useStorage } from "./use-storage";

/**
 * React hook for persisting state in `sessionStorage`.
 *
 * Values survive page reloads within the same browser tab but are cleared
 * when the tab or window is closed.
 *
 * @param key - The key under which the value is stored.
 * @param initialValue - Optional initial value used when no stored value exists.
 * @returns A tuple of `[value, setValue, removeValue]`.
 *   - `value` — current stored value (or `initialValue` / `undefined`).
 *   - `setValue` — setter, same signature as `React.useState`.
 *   - `removeValue` — removes the entry from storage and resets to `undefined`.
 *
 * @example
 * const [step, setStep, clearStep] = useSessionStorage<number>("wizard-step", 1);
 */
export const useSessionStorage: UseStorageFn = (<T>(
  key: string,
  initialValue?: T
) => {
  return useStorage<T>(
    "sessionStorage",
    baseStorages.sessionStorage,
    key,
    initialValue
  );
}) as UseStorageFn;
