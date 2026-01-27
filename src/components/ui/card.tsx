import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  header: string;
  content: string | ReactNode;
  headerIcon?: ReactNode;
  headerRight?: ReactNode;
  hideContent?: boolean;
  fillHeight?: boolean;
}

export const Card = ({
  header,
  content,
  headerIcon,
  headerRight,
  hideContent = false,
  fillHeight = false,
}: CardProps) => {
  return (
    <div
      className={twMerge(
        "flex flex-col rounded-md bg-zinc-800 shadow-black/50 shadow-xs ring-1 ring-zinc-700/70",
        fillHeight && "h-full",
      )}
    >
      <header className="flex select-none justify-between p-2">
        <h1 className="flex items-center gap-2 text-md text-white">
          {headerIcon ? (
            <div className="text-zinc-400">{headerIcon}</div>
          ) : null}
          {header}
        </h1>
        {headerRight ? (
          <div className="flex items-center">{headerRight}</div>
        ) : null}
      </header>
      {hideContent ? null : (
        <>
          <hr className="border-zinc-700/70 shadow-hr shadow-zinc-900/70" />
          <div
            className={twMerge(
              "p-2",
              typeof content === "string" && "text-sm text-zinc-500",
              fillHeight && "h-full",
            )}
          >
            {content}
          </div>
        </>
      )}
    </div>
  );
};
