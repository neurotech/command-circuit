import { Copy } from "lucide-react";
import { FlatButton } from "../../../components/ui/flat-button";

interface TimestampFormatRowProps {
  preview: string;
  onCopy: () => void;
  className?: string;
}

export const TimestampFormatRow = ({
  preview,
  onCopy,
  className,
}: TimestampFormatRowProps) => {
  return (
    <FlatButton
      variant="yellow"
      onClick={onCopy}
      className={`flex items-center justify-between px-2 py-4 text-sm ${className ?? ""}`}
    >
      {preview}
      <Copy size={14} />
    </FlatButton>
  );
};
