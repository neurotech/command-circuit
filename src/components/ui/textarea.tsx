import { type ComponentProps, type ReactNode, useId } from "react";
import { twMerge } from "tailwind-merge";

type TextAreaProps = { label: string | ReactNode } & ComponentProps<"textarea">;

export const TextArea = ({ className, label, id, ...props }: TextAreaProps) => {
  const generatedId = useId();
  const textareaId = id ?? generatedId;

  return (
    <div className={twMerge("flex flex-col gap-1", className)}>
      <label htmlFor={textareaId} className="text-sm text-zinc-400">
        {label}
      </label>
      <textarea
        id={textareaId}
        {...props}
        className="min-h-24 flex-1 rounded-sm border border-zinc-600 bg-zinc-700/80 p-2 font-mono text-xs text-zinc-400 shadow-sm transition-colors focus:border-indigo-500 focus:bg-zinc-700/30 focus:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:selection:bg-zinc-800"
      />
    </div>
  );
};
