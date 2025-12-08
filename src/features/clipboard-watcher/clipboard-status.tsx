import {
  StatusPanel,
  type StatusPanelProps,
} from "../../components/ui/status-panel";
import type { Status } from "./clipboard-watcher";

const statusMap: Record<
  Status,
  Pick<StatusPanelProps, "status" | "statusText">
> = {
  idle: { status: "dark", statusText: "Watching the clipboard..." },
  match: { status: "green", statusText: "Match found!" },
  copied: { status: "yellow", statusText: "Copied to clipboard!" },
  exists: { status: "light", statusText: "Already in history." },
  credentials: { status: "red", statusText: "API credentials not found." },
  error: { status: "red", statusText: "Error occurred." },
};

type ClipboardStatusProps = {
  status: Status;
};

export const ClipboardStatus = ({ status }: ClipboardStatusProps) => {
  const metadata = statusMap[status];
  return (
    <StatusPanel
      animate={status === "idle"}
      statusText={metadata.statusText}
      status={metadata.status}
    />
  );
};
