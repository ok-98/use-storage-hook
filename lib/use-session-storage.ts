import { baseStorages, UseStorageFn } from "./types";
import { useStorage } from "./use-storage";

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
