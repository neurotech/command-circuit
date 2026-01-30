import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { use, useCallback } from "react";
import { AlertContext } from "../context/alert-context";

export const useCopyToClipboard = () => {
  const { sendAlert } = use(AlertContext);

  const copy = useCallback(
    async (text: string, message?: string) => {
      await writeText(text);
      sendAlert({
        type: "success",
        content: message ?? `Copied to clipboard!`,
      });
    },
    [sendAlert],
  );

  return { copy };
};
