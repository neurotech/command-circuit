import type { ComponentProps, ReactNode } from "react";

type TextAreaProps = { label: string | ReactNode } & ComponentProps<"textarea">;

export const TextArea = ({ label, ...props }: TextAreaProps) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-xs text-zinc-400">{label}</div>
      <textarea
        {...props}
        className="min-h-24 rounded-sm border border-zinc-600 bg-zinc-700/80 p-2 font-mono text-[11px] text-zinc-400 shadow-sm transition-colors focus:border-indigo-500 focus:bg-zinc-700/30 focus:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:selection:bg-zinc-800"
      />
    </div>
  );
};
