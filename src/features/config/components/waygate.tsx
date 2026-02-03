import { DoorOpen, LoaderPinwheel } from "lucide-react";
import { use, useCallback, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { TextInput } from "../../../components/ui/text-input";
import { AlertContext } from "../../../context/alert-context";
import { ConfigContext } from "../../../context/config-context";
import { useKeyboardShortcut } from "../../../hooks/useKeyboardShortcut";

export const Waygate = () => {
  const { sendAlert } = use(AlertContext);
  const {
    loading,
    waygateUrl,
    configDialogOpen,
    saveWaygateUrl,
    getWaygateUrl,
  } = use(ConfigContext);

  const [url, setUrl] = useState<string>(waygateUrl ?? "");

  const handleSave = useCallback(async () => {
    await saveWaygateUrl(url);
    sendAlert({ type: "success", content: "Waygate URL saved successfully." });
    await getWaygateUrl();
  }, [url, saveWaygateUrl, getWaygateUrl, sendAlert]);

  useKeyboardShortcut({
    key: "Enter",
    metaKey: true,
    eventType: "keyup",
    enabled: configDialogOpen,
    handler: handleSave,
  });

  return (
    <>
      <Card
        header="Waygate"
        headerIcon={<DoorOpen size={16} />}
        headerRight={
          loading ? (
            <LoaderPinwheel
              size={16}
              className="animate-spin text-yellow-300"
            />
          ) : null
        }
        content={
          <TextInput
            label="Waygate URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            valid={loading || url.length > 0}
            disabled={loading}
          />
        }
      />

      <div className="flex justify-end">
        <Button variant={"emerald"} onClick={handleSave} shortcut={"⌘ ⏎"} small>
          Save
        </Button>
      </div>
    </>
  );
};
