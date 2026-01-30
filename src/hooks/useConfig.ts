import { load, type Store } from "@tauri-apps/plugin-store";
import { useCallback, useEffect, useState } from "react";
import type { HistoryItem } from "../features/clipboard-watcher/history-panel";

type ConfigKey =
  | "clipboard-history"
  | "github-api-key"
  | "linear-api-key"
  | "today"
  | "debug-mode"
  | "discord-timestamp-visible"
  | "fancy-text-visible";

export const useConfig = () => {
  const [store, setStore] = useState<Store | undefined>();

  const insert = useCallback(
    async <T extends { id: string }>(key: ConfigKey, value: T) => {
      if (!store) return;
      const previous = ((await store.get(key)) ?? []) as T[];
      // Prevent duplicates by checking the store directly
      if (previous.some((item) => item.id === value.id)) {
        return;
      }
      await store.set(key, [...previous, value]);
    },
    [store],
  );

  const update = useCallback(
    async <T>(key: ConfigKey, value: T) => {
      if (!store) return [];
      await store.set(key, value);
    },
    [store],
  );

  const get = useCallback(
    async <T>(key: ConfigKey): Promise<T | undefined> => {
      if (!store) return undefined;
      const value = (await store.get(key)) ?? [];
      return value as T;
    },
    [store],
  );

  const clear = useCallback(
    async (key: ConfigKey) => {
      if (!store) return;
      await store.delete(key);
    },
    [store],
  );

  const remove = useCallback(
    async (key: ConfigKey, id: string) => {
      if (!store) return;
      const previous = ((await store.get(key)) ?? []) as HistoryItem[];
      const updated = previous.filter((item) => item.id !== id);
      await store.set(key, updated);
    },
    [store],
  );

  useEffect(() => {
    if (!store) {
      const loadStore = async () => {
        const store = await load("config.json", {
          autoSave: true,
          defaults: {
            "clipboard-history": [],
            "linear-api-key": "",
            "github-api-key": "",
            today: undefined,
            "debug-mode": false,
            "discord-timestamp-visible": false,
            "fancy-text-visible": false,
          },
        });
        setStore(store);
      };

      loadStore();
    }
  }, [store]);

  return {
    get,
    insert,
    update,
    clear,
    remove,
  };
};
