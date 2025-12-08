import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const statusPanelVariants = cva(
  "min-w-40 flex flex-1 select-none items-center justify-center rounded-sm border p-2 py-1 text-xs transition-colors",
  {
    variants: {
      status: {
        dark: "border-zinc-900/60 bg-zinc-900/40 text-zinc-400",
        green: "border-emerald-500/20 bg-emerald-700/20 text-emerald-500",
        yellow: "border-yellow-500/10 bg-yellow-700/10 text-yellow-400",
        light: "border-zinc-700/60 bg-zinc-700/40 text-zinc-500",
        red: "border-red-500/10 bg-red-700/10 text-red-400",
      },
    },
  },
);

export type StatusPanelProps = {
  statusText: string;
  animate?: boolean;
} & ComponentProps<"div"> &
  VariantProps<typeof statusPanelVariants>;

export const StatusPanel = ({
  className,
  status,
  statusText,
  animate,
}: StatusPanelProps) => {
  return (
    <div className={twMerge(statusPanelVariants({ status }), className)}>
      <div
        className={twMerge(
          animate ? "animate-[pulse_5s_ease-in-out_infinite]" : "",
        )}
      >
        {status ? statusText : null}
      </div>
    </div>
  );
};
