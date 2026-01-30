import { Copy } from "lucide-react";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import { FlatButton } from "./flat-button";

interface CopyableRowProps {
  children: ReactNode;
  onCopy: () => void;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
}

export const CopyableRow = ({
  children,
  onCopy,
  ariaLabel,
  disabled,
  className,
}: CopyableRowProps) => {
  return (
    <FlatButton
      variant="yellow"
      onClick={onCopy}
      disabled={disabled}
      aria-label={ariaLabel}
      className={twMerge(
        "flex items-center justify-between px-2 py-4",
        className,
      )}
    >
      {children}
      <Copy size={14} aria-hidden="true" />
    </FlatButton>
  );
};
