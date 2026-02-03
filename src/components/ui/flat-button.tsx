import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const flatButtonVariants = cva(
  "flex cursor-pointer items-center bg-zinc-700 px-2 py-1 text-zinc-300 transition-colors disabled:bg-zinc-700/20 disabled:from-zinc-800/50 disabled:to-zinc-800 disabled:text-zinc-950/50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        red: "enabled:hover:bg-red-400 enabled:hover:text-red-950",
        yellow: "enabled:hover:bg-yellow-400 enabled:hover:text-yellow-950",
        green: "enabled:hover:bg-emerald-400 enabled:hover:text-emerald-950",
        blue: "enabled:hover:bg-blue-400 enabled:hover:text-blue-950",
      },
    },
    defaultVariants: {
      variant: "red",
    },
  },
);

type FlatButtonProps = {
  isActive?: boolean;
} & ComponentProps<"button"> &
  VariantProps<typeof flatButtonVariants>;

export const FlatButton = ({
  className,
  variant,
  isActive,
  ...props
}: FlatButtonProps) => {
  return (
    <button
      type="button"
      className={twMerge(
        flatButtonVariants({ variant }),
        isActive && "bg-amber-400/50 text-amber-100",
        className,
      )}
      {...props}
    >
      {props.children}
    </button>
  );
};
