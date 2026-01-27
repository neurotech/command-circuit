import { use } from "react";
import { twMerge } from "tailwind-merge";
import { Card } from "../../../components/ui/card";
import { ConfigContext } from "../../../context/config-context";

export const DebugMode = () => {
  const { debugMode, toggleDebugMode } = use(ConfigContext);

  return (
    <>
      <Card
        header={"Debug Mode"}
        content={
          <button
            type="button"
            onClick={toggleDebugMode}
            className={twMerge(
              "inline-flex h-[1.15rem] w-8 shrink-0 cursor-pointer items-center rounded-full outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50",
              debugMode ? "bg-green-900" : "bg-zinc-600",
            )}
          >
            <span
              className={twMerge(
                "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
                debugMode
                  ? "translate-x-[calc(100%-2px)] bg-green-400"
                  : "translate-0 bg-zinc-400",
              )}
            ></span>
          </button>
        }
      />
      ;
    </>
  );
};
