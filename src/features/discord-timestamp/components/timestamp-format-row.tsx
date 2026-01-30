import { CopyableRow } from "../../../components/ui/copyable-row";

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
    <CopyableRow
      onCopy={onCopy}
      ariaLabel={`Copy ${preview}`}
      className={`grow-0 text-xs ${className ?? ""}`}
    >
      {preview}
    </CopyableRow>
  );
};
