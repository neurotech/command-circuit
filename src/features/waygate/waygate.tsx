import { invoke } from "@tauri-apps/api/core";
import { openUrl } from "@tauri-apps/plugin-opener";
import { DoorOpen, LoaderPinwheel, Trash2, TriangleAlert } from "lucide-react";
import { use, useCallback, useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { FlatButton } from "../../components/ui/flat-button";
import { ConfigContext } from "../../context/config-context";

type WaygateItem = {
  id: number;
  item: string;
  title: string;
};

type FetchStatus = "idle" | "loading" | "success" | "error";

export const Waygate = () => {
  const { waygateUrl } = use(ConfigContext);

  const [items, setItems] = useState<WaygateItem[]>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!waygateUrl) {
      setStatus("idle");
      return;
    }

    setStatus("loading");
    setError(null);

    try {
      const data = await invoke<WaygateItem[]>("fetch_waygate_items", {
        url: waygateUrl,
      });
      setItems(data);
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }, [waygateUrl]);

  const deleteItem = useCallback(
    async (id: number) => {
      try {
        await invoke("delete_waygate_item", { url: waygateUrl, id });
        setItems((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setStatus("error");
      }
    },
    [waygateUrl],
  );

  useEffect(() => {
    fetchItems();
    const interval = setInterval(fetchItems, 60000);
    return () => clearInterval(interval);
  }, [fetchItems]);

  if (!waygateUrl) {
    return null;
  }

  return (
    <Card
      header="Waygate"
      headerIcon={<DoorOpen size={16} />}
      headerRight={
        <Button small onClick={fetchItems} disabled={status === "loading"}>
          <LoaderPinwheel
            size={14}
            className={status === "loading" ? "animate-spin" : ""}
          />
        </Button>
      }
      content={
        <div className="flex flex-col gap-2">
          {status === "error" && (
            <div className="flex items-center gap-2 rounded-sm bg-red-950/30 p-2 text-red-400">
              <TriangleAlert size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {status === "loading" || items.length === 0 ? (
            <div className="py-2 text-center text-sm text-zinc-500">
              Watching...
            </div>
          ) : null}

          {items.length > 0 && (
            <div className="flex flex-col gap-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-px">
                  <FlatButton
                    variant={"red"}
                    onClick={() => void deleteItem(item.id)}
                    className="rounded-l-xs"
                  >
                    <Trash2 className="size-3" />
                  </FlatButton>

                  <FlatButton
                    variant={"blue"}
                    onClick={() => void openUrl(item.item)}
                    className="w-full rounded-r-xs"
                  >
                    <div className="grid w-full grid-cols-5 items-center">
                      <span className="col-span-3 truncate text-left font-medium text-xs">
                        {item.title}
                      </span>
                      <span className="col-span-2 truncate text-ellipsis text-left font-mono text-2xs opacity-60">
                        {item.item}
                      </span>
                    </div>
                  </FlatButton>
                </div>
              ))}
            </div>
          )}
        </div>
      }
    />
  );
};
