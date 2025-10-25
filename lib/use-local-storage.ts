import { baseStorages, UseStorageFn } from "./types";
import { useStorage } from "./use-storage";

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
