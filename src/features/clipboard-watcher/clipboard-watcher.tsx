import { readText, writeText } from "@tauri-apps/plugin-clipboard-manager";
import { Clipboard } from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { AlertContext } from "../../context/alert-context";
import { ConfigContext } from "../../context/config-context";
import { useConfig } from "../../hooks/useConfig";
import { ClipboardStatus } from "./clipboard-status";
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
  const { sendAlert } = useContext(AlertContext);
  const { credentials, configValidation } = useContext(ConfigContext);
  const { get, insert, clear, remove } = useConfig();

  const [status, setStatus] = useState<Status>("idle");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeItem, setActiveItem] = useState<string | undefined>();

  const resetStatus = useCallback(() => {
    setStatus("idle");
    setActiveItem(undefined);
  }, []);

  const getHistory = useCallback(() => {
    get<HistoryItem[]>("clipboard-watcher-history")
      .then((history) => {
        history && setHistory(history);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [get]);

  useEffect(() => {
    getHistory();
  }, [getHistory]);

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
          if (history.some((h) => h.id === parseResult.id)) {
            setStatus("exists");
            setActiveItem(parseResult.id);

            return;
          }

          setStatus("match");

          if (parseResult.type === "linear") {
            getIssue(parseResult.id, credentials.linear)
              .then((item) => {
                insert<HistoryItem>("clipboard-watcher-history", item)
                  .then(() => getHistory())
                  .catch((error) => {
                    console.error(error);
                  });
                sendAlert({
                  type: "success",
                  content: "Issue fetched successfully",
                });
              })
              .catch((_) => {
                sendAlert({ type: "error", content: "Failed to fetch issue" });
                setStatus("error");
              });
          }

          if (parseResult.type === "github") {
            const item = await getPR(text, credentials.github);
            insert<HistoryItem>("clipboard-watcher-history", item)
              .then(() => getHistory())
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
    getHistory,
    history,
    resetStatus,
    status,
    configValidation.credentials.valid,
    credentials,
    sendAlert,
  ]);

  const onItemClick = useCallback(async () => {
    setStatus("copied");

    const timeout = setTimeout(() => {
      resetStatus();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [resetStatus]);

  const handleRemove = useCallback(
    async (id: string) => {
      if (id === activeItem) {
        await writeText("");
        resetStatus();
      }

      await remove("clipboard-watcher-history", id);
      getHistory();
    },
    [remove, getHistory, activeItem, resetStatus],
  );

  return (
    <Card
      header="Clipboard Watcher"
      headerIcon={<Clipboard size={16} />}
      headerRight={
        <div className="flex flex-row items-center gap-2">
          <ClipboardStatus status={status} />
          <Button
            small
            disabled={
              !configValidation.credentials.valid || history.length === 0
            }
            onClick={() => {
              void clear("clipboard-watcher-history");
              getHistory();
            }}
          >
            Clear
          </Button>
        </div>
      }
      content={
        <section className="flex flex-row gap-2 truncate">
          <div className="flex flex-1 flex-col gap-2 overflow-hidden">
            <HistoryPanel
              history={history}
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
