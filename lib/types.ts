import { Dispatch, SetStateAction } from "react";
import { isSSR } from "./util";

export const baseStorages = {
  localStorage: isSSR() ? "ssr" : window.localStorage,
  sessionStorage: isSSR() ? "ssr" : window.sessionStorage,
} as const satisfies Record<CustomStorageName, Storage | "ssr">;

export type BaseStorages = typeof baseStorages;
export type BaseStorageKey = keyof BaseStorages;
export type BaseStorageValue = BaseStorages[BaseStorageKey];

export type CustomStorageName = `${string}Storage`;

export type Storages = BaseStorages;
export type StorageKey = BaseStorageKey | CustomStorageName;
export type StorageValue = BaseStorageValue;

export type StorageParser<T> = {
  parse: (value: string) => T;
  stringify: (value: T | undefined) => string;
};

type UseStorageFnNullable = <T>(
  key: string,
  initialValue?: undefined
) => [T | undefined, Dispatch<SetStateAction<T>>, () => void];

type UseStorageFnNonNullable = <T>(
  key: string,
  initialValue: T
) => [T, Dispatch<SetStateAction<T>>, () => void];

export type UseStorageFn = UseStorageFnNullable & UseStorageFnNonNullable;
