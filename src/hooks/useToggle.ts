import { useCallback, useEffect, useState } from "react";
import { useConfig } from "./useConfig";

type ConfigKey = Parameters<ReturnType<typeof useConfig>["get"]>[0];

export const useToggle = (key: ConfigKey, defaultValue: boolean) => {
  const { get, update } = useConfig();
  const [value, setValue] = useState(defaultValue);

  const load = useCallback(async () => {
    const stored = await get<boolean>(key);
    setValue(stored ?? defaultValue);
  }, [get, key, defaultValue]);

  const toggle = useCallback(async () => {
    const newValue = !value;
    await update(key, newValue);
    setValue(newValue);
  }, [update, key, value]);

  useEffect(() => {
    load();
  }, [load]);

  return [value, toggle] as const;
};
