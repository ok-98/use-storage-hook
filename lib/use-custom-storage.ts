import { Dispatch, SetStateAction } from "react";
import { StorageKey, StorageParser, StorageValue } from "./types";
import { useStorage } from "./use-storage";

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
