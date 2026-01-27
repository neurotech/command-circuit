import type { ComponentProps, ReactNode } from "react";

type TextInputProps = {
  label: string | ReactNode;
  valid?: boolean;
} & ComponentProps<"input">;

export const TextInput = ({
  label,
  valid = false,
  ...props
}: TextInputProps) => {
  return (
    <div className="group flex flex-col gap-1.5">
      <div
        className="select-none text-xs text-zinc-400 group-focus-within:text-white data-[valid=false]:text-rose-200 group-focus-within:data-[valid=false]:text-rose-400"
        data-valid={valid}
      >
        {label}
      </div>
      <input
        {...props}
        className="rounded-sm border border-zinc-600 bg-zinc-700/80 p-2 font-mono text-[11px] text-zinc-400 shadow-sm transition-colors focus:border-indigo-500 focus:bg-zinc-600 focus:text-zinc-50 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 focus:selection:bg-zinc-800 disabled:cursor-not-allowed disabled:select-none disabled:border-zinc-900 disabled:bg-zinc-900/40 disabled:text-zinc-600 data-[valid=false]:border-rose-400 data-[valid=false]:bg-rose-800/20 data-[valid=false]:text-rose-400 data-[valid=false]:focus:bg-rose-950/20 data-[valid=false]:focus:ring-red-500/25"
        data-valid={valid}
      />
    </div>
  );
};
