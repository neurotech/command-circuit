import {
  CircleCheck,
  Fingerprint,
  LoaderPinwheel,
  TriangleAlert,
} from "lucide-react";
import { use, useCallback, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { TextInput } from "../../../components/ui/text-input";
import { AlertContext } from "../../../context/alert-context";
import { ConfigContext } from "../../../context/config-context";
import { useKeyboardShortcut } from "../../../hooks/useKeyboardShortcut";

export const Credentials = () => {
  const { sendAlert } = use(AlertContext);
  const {
    loading,
    credentials,
    configDialogOpen,
    saveCredentials,
    configValidation,
    getCredentials,
  } = use(ConfigContext);

  const [github, setGithub] = useState<string>(credentials.github ?? "");
  const [linear, setLinear] = useState<string>(credentials.linear ?? "");

  const handleSave = useCallback(async () => {
    await saveCredentials({ github, linear });
    sendAlert({ type: "success", content: "Credentials saved successfully." });
    await getCredentials();
  }, [github, linear, saveCredentials, getCredentials, sendAlert]);

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
        header="Credentials"
        headerIcon={<Fingerprint size={16} />}
        headerRight={
          loading ? (
            <LoaderPinwheel
              size={16}
              className="animate-spin text-yellow-300"
            />
          ) : configValidation.credentials.valid ? (
            <CircleCheck size={16} className="text-emerald-500" />
          ) : (
            <TriangleAlert size={16} className="text-red-400" />
          )
        }
        content={
          <div className="flex flex-col gap-4">
            <TextInput
              label="GitHub API Key"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              valid={loading || github.length > 0}
              disabled={loading}
            />
            <TextInput
              label="Linear API Key"
              value={linear}
              onChange={(e) => setLinear(e.target.value)}
              valid={loading || linear.length > 0}
              disabled={loading}
            />
          </div>
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
