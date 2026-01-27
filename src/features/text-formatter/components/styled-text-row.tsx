import { Copy } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { FlatButton } from "../../../components/ui/flat-button";

interface StyledTextRowProps {
  preview: string;
  onCopy: () => void;
  name: string;
  disabled?: boolean;
  className?: string;
}

export const StyledTextRow = ({
  preview,
  onCopy,
  name,
  disabled,
  className,
}: StyledTextRowProps) => {
  return (
    <FlatButton
      variant="yellow"
      onClick={onCopy}
      disabled={disabled}
      className={twMerge(
        "flex items-center justify-between px-2 py-4",
        className,
      )}
    >
      <p className="truncate text-sm">{preview === "" ? name : preview}</p>
      <Copy size={14} />
    </FlatButton>
  );
};
