import { CopyableRow } from "../../../components/ui/copyable-row";

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
    <CopyableRow
      onCopy={onCopy}
      disabled={disabled}
      ariaLabel={`Copy ${name} text`}
      className={className}
    >
      <p className="truncate text-sm">{preview === "" ? name : preview}</p>
    </CopyableRow>
  );
};
