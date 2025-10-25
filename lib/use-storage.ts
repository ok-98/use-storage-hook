import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { StorageKey, StorageParser, StorageValue } from "./types";
import { isDefined } from "only-utils";

export const useStorage = <T>(
  storageName: StorageKey,
  storage: StorageValue,
  key: string,
  initialValue?: T,
  customParser?: StorageParser<T>
) => {
  const { parse, stringify } = useMemo<StorageParser<T>>(() => {
    if (isDefined(customParser)) {
      return customParser;
    }
    return {
      parse: (value: string) => JSON.parse(value) as T,
      stringify: (value: T | undefined) => JSON.stringify(value),
    };
  }, [customParser]);

  const eventName = `${storageName}-storage-${key}`;
  const initialValueRef = useRef(initialValue);
  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  const hasInitialValue = isDefined(initialValue);

  const rawValue = useSyncExternalStore(
    (subscribe) => {
      document.addEventListener(eventName, subscribe);
      return () => {
        document.removeEventListener(eventName, subscribe);
      };
    },
    () => (storage === "ssr" ? undefined : storage.getItem(key)),
    () => (isDefined(initialValue) ? stringify(initialValue) : undefined)
  );

  const parsedValue = useMemo(
    () => (isDefined(rawValue) ? parse(rawValue) : initialValue),
    [initialValue, parse, rawValue]
  );

  const parsedValueRef = useRef(parsedValue);
  useEffect(() => {
    parsedValueRef.current = parsedValue;
  }, [parsedValue]);

  const setValue: Dispatch<SetStateAction<T | undefined>> = useCallback(
    (value: SetStateAction<T | undefined>) => {
      try {
        const valueToStore =
          value instanceof Function
            ? value((parsedValueRef.current ?? initialValueRef.current) as T)
            : value;
        if (storage === "ssr") {
          return;
        }
        storage.setItem(key, stringify(valueToStore));
        document.dispatchEvent(new Event(eventName));
      } catch (error) {
        console.error("Parsing error", { error });
      }
    },
    [eventName, key, storage, stringify]
  );

  const removeValue = useCallback(() => {
    if (storage === "ssr") {
      console.warn(
        `Tried removing ${storageName} key "${key}" even though environment is not a client`
      );
      return;
    }
    storage.removeItem(key);
    document.dispatchEvent(new Event(eventName));
  }, [eventName, key, storage, storageName]);

  return [
    hasInitialValue ? (parsedValue ?? initialValue) : parsedValue,
    setValue,
    removeValue,
  ] as const;
};
