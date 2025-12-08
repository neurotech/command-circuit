import "./App.css";
import { useContext, useEffect, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../components/ui/button";
import { ConfigContext } from "../context/config-context";
import { Alert } from "../features/alert/alert";
import { ClipboardWatcher } from "../features/clipboard-watcher/clipboard-watcher";
import { ConfigDialog } from "../features/config/config-dialog";
import { GoodMorning } from "../features/good-morning/good-morning";

function App() {
  const { configDialogOpen, toggleConfigDialog, configValidation } =
    useContext(ConfigContext);

  const showConfigAlert = useMemo(() => {
    return !configValidation.credentials.valid && !configDialogOpen;
  }, [configValidation.credentials.valid, configDialogOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!configDialogOpen && event.metaKey && event.key === ",") {
        toggleConfigDialog();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [configDialogOpen, toggleConfigDialog]);

  return (
    <div
      role="document"
      className="flex h-screen flex-col justify-between bg-zinc-900 font-display text-white selection:bg-zinc-400 selection:text-zinc-100"
    >
      <ConfigDialog />
      {showConfigAlert ? (
        <button
          className="flex cursor-pointer items-center justify-center border-b border-b-rose-950 bg-rose-500 p-1 font-medium text-rose-950 text-xs"
          onClick={toggleConfigDialog}
          type="button"
        >
          Command Circuit is missing key configuration. Click here to open the
          configuration dialog.
        </button>
      ) : null}
      <main className="relative flex flex-1 flex-col gap-2 overflow-y-auto p-2">
        <ClipboardWatcher />
        <GoodMorning />
      </main>
      <footer
        className={twMerge("flex border-t border-t-zinc-700/70 bg-zinc-800")}
      >
        <Alert />
        <div className="p-2">
          <Button onClick={toggleConfigDialog} shortcut="⌘ ,">
            Configuration
          </Button>
        </div>
      </footer>
    </div>
  );
}

export default App;
