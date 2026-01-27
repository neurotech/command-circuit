import { readText, writeText } from "@tauri-apps/plugin-clipboard-manager";
import { Clipboard } from "lucide-react";
import { use, useCallback, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { AlertContext } from "../../context/alert-context";
import { ConfigContext } from "../../context/config-context";
import { useConfig } from "../../hooks/useConfig";
import { type HistoryItem, HistoryPanel } from "./history-panel";
import { getPR } from "./utils/github-api";
import { getIssue } from "./utils/linear-api";
import { parseClipboard } from "./utils/parse-clipboard";

export type Status =
  | "idle"
  | "match"
  | "copied"
  | "exists"
  | "credentials"
  | "error";

export const ClipboardWatcher = () => {
  const { sendAlert } = use(AlertContext);
  const {
    credentials,
    configValidation,
    clipboardHistory,
    refreshClipboardHistory,
  } = use(ConfigContext);
  const { insert, clear, remove } = useConfig();

  const [status, setStatus] = useState<Status>("idle");
  const [activeItem, setActiveItem] = useState<string | undefined>();

  const resetStatus = useCallback(() => {
    setStatus("idle");
    setActiveItem(undefined);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!configValidation.credentials.valid) {
        setStatus("credentials");
        return;
      }

      try {
        const text = await readText();

        if (!text || text === "" || status === "copied" || status === "error") {
          return;
        }

        const parseResult = parseClipboard(text);

        if (parseResult) {
          if (clipboardHistory.some((h) => h.id === parseResult.id)) {
            setStatus("exists");
            setActiveItem(parseResult.id);

            return;
          }

          setStatus("match");

          if (parseResult.type === "linear") {
            getIssue(parseResult.id, credentials.linear)
              .then((item) => {
                insert<HistoryItem>("clipboard-history", item)
                  .then(() => refreshClipboardHistory())
                  .catch((error) => {
                    console.error(error);
                  });
                sendAlert({
                  type: "success",
                  content: "Issue fetched successfully.",
                });
              })
              .catch((_) => {
                sendAlert({ type: "error", content: "Failed to fetch issue." });
                setStatus("error");
              });
          }

          if (parseResult.type === "github") {
            const item = await getPR(text, credentials.github);
            insert<HistoryItem>("clipboard-history", item)
              .then(() => refreshClipboardHistory())
              .catch((error) => {
                console.error(error);
              });
          }
        } else {
          resetStatus();
        }
      } catch (_) {
        return;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    insert,
    clipboardHistory,
    refreshClipboardHistory,
    resetStatus,
    status,
    configValidation.credentials.valid,
    credentials,
    sendAlert,
  ]);

  const onItemClick = useCallback(
    async (content: string) => {
      setStatus("copied");

      sendAlert({
        type: "success",
        content,
      });

      const timeout = setTimeout(() => {
        resetStatus();
      }, 2000);

      return () => clearTimeout(timeout);
    },
    [resetStatus, sendAlert],
  );

  const handleRemove = useCallback(
    async (id: string) => {
      if (id === activeItem) {
        await writeText("");
        resetStatus();
      }

      await remove("clipboard-history", id);
      refreshClipboardHistory();
    },
    [remove, refreshClipboardHistory, activeItem, resetStatus],
  );

  return (
    <Card
      header="Clipboard Watcher"
      headerIcon={<Clipboard size={16} />}
      headerRight={
        <Button
          small
          disabled={!configValidation.credentials.valid || history.length === 0}
          onClick={() => {
            void clear("clipboard-history");
            refreshClipboardHistory();
          }}
        >
          Clear
        </Button>
      }
      content={
        <section className="flex flex-row gap-2 truncate">
          <div className="flex flex-1 flex-col gap-2 overflow-hidden">
            <HistoryPanel
              history={clipboardHistory}
              onItemClick={onItemClick}
              onRemoveClick={handleRemove}
              activeItem={activeItem}
            />
          </div>
        </section>
      }
    />
  );
};
