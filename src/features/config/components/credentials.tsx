import {
  CircleCheck,
  Fingerprint,
  LoaderPinwheel,
  TriangleAlert,
} from "lucide-react";
import { useCallback, useContext, useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { TextInput } from "../../../components/ui/text-input";
import { AlertContext } from "../../../context/alert-context";
import { ConfigContext } from "../../../context/config-context";

export const Credentials = () => {
  const { sendAlert } = useContext(AlertContext);
  const {
    loading,
    credentials,
    configDialogOpen,
    saveCredentials,
    configValidation,
    getCredentials,
  } = useContext(ConfigContext);

  const [github, setGithub] = useState<string>(credentials.github ?? "");
  const [linear, setLinear] = useState<string>(credentials.linear ?? "");

  const handleSave = useCallback(async () => {
    await saveCredentials({ github, linear });
    sendAlert({ type: "success", content: "Credentials saved successfully" });

    await getCredentials();
  }, [github, linear, saveCredentials, getCredentials, sendAlert]);

  useEffect(() => {
    setGithub(credentials.github ?? "");
    setLinear(credentials.linear ?? "");
  }, [credentials]);

  useEffect(() => {
    const keyboardListener = (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "Enter") {
        handleSave();
      }
    };

    if (configDialogOpen) {
      document.addEventListener("keyup", keyboardListener);
    } else {
      document.removeEventListener("keyup", keyboardListener);
    }

    return () => {
      document.removeEventListener("keyup", keyboardListener);
    };
  }, [configDialogOpen, handleSave]);

  return (
    <div className="col-span-2 flex flex-col gap-2">
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

            <div className="flex justify-end">
              <Button
                variant={"emerald"}
                onClick={handleSave}
                shortcut={"⌘ ⏎"}
                small
              >
                Save
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
};
