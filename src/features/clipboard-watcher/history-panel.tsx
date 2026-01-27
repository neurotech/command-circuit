import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { openUrl } from "@tauri-apps/plugin-opener";
import {
  GitPullRequest,
  GitPullRequestCreateArrow,
  Split,
  SquareArrowOutUpRight,
  SquareKanban,
  Trash2,
} from "lucide-react";
import { useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { FlatButton } from "../../components/ui/flat-button";

export type HistoryItem = {
  id: string;
  type: "linear" | "github";
  label: string;
  markdown: string;
  date: Date;
  url: string;
  branch_name?: string;
  pr_name?: string;
};

type HistoryProps = {
  history: HistoryItem[];
  onItemClick: (content: string) => void;
  onRemoveClick: (id: string) => void;
  activeItem?: string;
};

export const HistoryPanel = ({
  history,
  onItemClick,
  onRemoveClick,
  activeItem,
}: HistoryProps) => {
  const copyText = useCallback(
    async (
      item: HistoryItem,
      contentType: "Markdown" | "PR name" | "Branch name" = "Markdown",
    ) => {
      if (contentType === "Markdown") {
        await writeText(item.markdown);
      } else if (contentType === "PR name" && item.pr_name) {
        await writeText(item.pr_name);
      } else if (contentType === "Branch name" && item.branch_name) {
        await writeText(item.branch_name);
      }

      const content = `${contentType} for ${item.type === "linear" ? "Linear issue" : "GitHub"} ${item.id} copied to clipboard.`;
      onItemClick(content);
    },
    [onItemClick],
  );

  return (
    <div className="flex select-none flex-col gap-0.5">
      {history.length === 0 ? (
        <div className="rounded-sm bg-zinc-600/30 px-2 py-1 text-center text-shadow-2xs text-xs text-zinc-400">
          Nothing captured yet.
        </div>
      ) : null}
      {history
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((item) => {
          const Icon = item.type === "linear" ? SquareKanban : GitPullRequest;
          const isActive = activeItem === item.id;

          return (
            <div
              key={item.id}
              className="flex flex-row border border-zinc-900/30"
            >
              <button
                className="group flex flex-1 cursor-pointer select-none flex-row overflow-hidden text-xs"
                onClick={() => copyText(item)}
                onKeyUp={() => copyText(item)}
                type="button"
              >
                <div
                  className={twMerge(
                    "flex min-w-26 flex-row items-center justify-between gap-1.25 rounded-l-xs border-l-3 border-l-zinc-400 bg-zinc-700 px-1.5 py-1 text-shadow-2xs text-zinc-300 transition-colors group-hover:border-l-emerald-400 group-hover:bg-emerald-400/30 group-hover:text-emerald-100",
                    item.type === "linear" && "border-l-indigo-400",
                    item.type === "github" && "border-l-pink-400",
                    isActive &&
                      "border-l-amber-400 bg-amber-400/50 text-amber-100",
                  )}
                >
                  <Icon
                    className={twMerge(
                      "size-3 text-zinc-400 transition-colors group-hover:text-emerald-50",
                      item.type === "linear" && "text-indigo-300/80",
                      item.type === "github" && "text-pink-300/80",
                      isActive && "text-amber-300",
                    )}
                  />
                  <div
                    className={twMerge(
                      "flex h-px w-full flex-1 bg-zinc-500 group-hover:bg-emerald-200/50",
                      isActive && "bg-amber-200/50",
                    )}
                  />

                  {item.id}
                </div>
                <div
                  className={twMerge(
                    "w-full truncate border-l border-l-zinc-800/50 bg-zinc-600/30 px-2 py-1 text-left text-shadow-2xs text-zinc-400 transition-colors group-hover:bg-emerald-400/10 group-hover:text-emerald-200",
                    isActive && "bg-amber-400/30 text-amber-200",
                  )}
                >
                  {item.label}
                </div>
              </button>

              <div className="flex gap-px border-l border-l-zinc-800/50">
                {item.branch_name ? (
                  <FlatButton
                    variant={"blue"}
                    isActive={isActive}
                    onClick={() => copyText(item, "Branch name")}
                  >
                    <Split className="size-3" />
                  </FlatButton>
                ) : null}

                {item.pr_name ? (
                  <FlatButton
                    variant={"green"}
                    isActive={isActive}
                    onClick={() => copyText(item, "PR name")}
                  >
                    <GitPullRequestCreateArrow className="size-3" />
                  </FlatButton>
                ) : null}

                <FlatButton
                  variant={"yellow"}
                  isActive={isActive}
                  onClick={() => void openUrl(item.url)}
                >
                  <SquareArrowOutUpRight className="size-3" />
                </FlatButton>

                <FlatButton
                  className={"rounded-r-xs"}
                  isActive={isActive}
                  onClick={() => void onRemoveClick(item.id)}
                >
                  <Trash2 className="size-3" />
                </FlatButton>
              </div>
            </div>
          );
        })}
    </div>
  );
};
