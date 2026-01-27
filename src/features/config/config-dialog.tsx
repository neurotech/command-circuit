import { use, useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ConfigContext } from "../../context/config-context";
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";
import { Credentials } from "./components/credentials";
import { DebugMode } from "./components/debug-mode";
import { Navigation } from "./components/navigation";

export const ConfigDialog = () => {
  const [activeItem, setActiveItem] = useState<number>(1);

  const { configDialogOpen, toggleConfigDialog } = use(ConfigContext);

  const getActiveContent = useCallback(() => {
    switch (activeItem) {
      case 1:
        return <Credentials />;
      case 3:
        return <DebugMode />;
      default:
        return null;
    }
  }, [activeItem]);

  useKeyboardShortcut({
    key: "Escape",
    eventType: "keyup",
    enabled: configDialogOpen,
    handler: toggleConfigDialog,
  });

  return configDialogOpen ? (
    <div
      className={twMerge(
        "absolute z-10 flex h-full w-full items-start justify-center bg-black/50 p-14 bg-blend-multiply backdrop-blur-xs [animation-duration:200ms]",
        configDialogOpen ? "animate-fade-in" : "animate-fade-out",
      )}
    >
      <div
        className={twMerge(
          "z-20 grid h-full flex-1 animate-fade-in grid-cols-3 flex-row justify-stretch rounded-md border border-zinc-950 bg-zinc-900 shadow-md [animation-delay:200ms] [animation-duration:150ms]",
          configDialogOpen ? "animate-fade-in" : "animate-fade-out",
        )}
      >
        <Navigation activeItem={activeItem} setActiveItem={setActiveItem} />

        <div className="col-span-2 flex flex-col justify-between gap-2 p-4">
          {getActiveContent()}
        </div>
      </div>
    </div>
  ) : null;
};
