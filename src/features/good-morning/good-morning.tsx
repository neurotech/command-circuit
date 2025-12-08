import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import {
  AlarmClock,
  CalendarClock,
  CalendarRange,
  Copy,
  Eye,
  EyeClosed,
  RefreshCw,
  TriangleAlert,
} from "lucide-react";
import { Markdown } from "markdown-to-jsx/react";
import { useCallback, useContext, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { FlatButton } from "../../components/ui/flat-button";
import { StatusPanel } from "../../components/ui/status-panel";
import { TextArea } from "../../components/ui/textarea";
import { AlertContext } from "../../context/alert-context";
import { useGreeting } from "./hooks/useGreeting";

export const GoodMorning = () => {
  const { sendAlert } = useContext(AlertContext);
  const { greeting, rerollGreeting } = useGreeting();
  const [yesterday, setYesterday] = useState("");
  const [today, setToday] = useState("");
  const [show, setShow] = useState(true);
  const [regenerate, setRegenerate] = useState(false);

  const gm = useMemo(() => {
    return `${greeting.message}${yesterday !== "" ? `\n\nYesterday:\n${yesterday}\n\n` : ""}${today !== "" ? `Today:\n${today}` : ""}
`;
  }, [greeting.message, yesterday, today]);

  const pristine = useMemo(() => {
    return yesterday === "" && today === "";
  }, [yesterday, today]);

  const regenerateGreeting = useCallback(() => {
    if (!regenerate) {
      setRegenerate(true);
      rerollGreeting();

      const timeout = setTimeout(() => {
        setRegenerate(false);
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [rerollGreeting, regenerate]);

  return (
    <Card
      header="Good Morning"
      headerIcon={<AlarmClock size={16} />}
      headerRight={
        <Button small onClick={() => setShow(!show)}>
          {show ? <Eye size={14} /> : <EyeClosed size={14} />}
        </Button>
      }
      content={
        show ? (
          <div className="flex select-none flex-col gap-4 text-xs">
            <TextArea
              label={
                <div className="flex items-center justify-between gap-1">
                  <p>{"What did you do yesterday?"}</p>
                  <CalendarClock size={12} className="text-zinc-400" />
                </div>
              }
              value={yesterday}
              onChange={(e) => setYesterday(e.target.value)}
            />
            <TextArea
              label={
                <div className="flex items-center justify-between gap-1">
                  <p>{"What are you planning to do today?"}</p>
                  <CalendarRange size={12} className="text-zinc-400" />
                </div>
              }
              value={today}
              onChange={(e) => setToday(e.target.value)}
            />
            <div className="flex select-none flex-col">
              {pristine ? (
                <StatusPanel
                  animate
                  status={"dark"}
                  statusText={greeting.message}
                  className="min-h-18 rounded-t-sm rounded-b-none p-2"
                />
              ) : (
                <Markdown className="pointer-events-none flex min-h-18 flex-col gap-2 rounded-t-sm border border-zinc-900/60 bg-zinc-900/40 p-2 text-shadow-2xs text-xs/5 text-zinc-400 leading-relaxed [&_a]:text-indigo-400 [&_a]:underline [&_code,&_a]:no-underline [&_code]:rounded-sm [&_code]:bg-zinc-900 [&_code]:px-1 [&_code]:py-px [&_code]:text-zinc-300/90 [&_ul]:list-inside [&_ul]:list-disc">
                  {gm}
                </Markdown>
              )}
              <div className="flex justify-between rounded-b-sm border border-zinc-900/60 border-t-0 bg-zinc-600/30">
                <div className="flex gap-px rounded-bl-sm bg-zinc-900/30">
                  <FlatButton
                    variant={"green"}
                    className="rounded-bl-sm"
                    onClick={regenerateGreeting}
                  >
                    <RefreshCw
                      className={regenerate ? "animate-spin" : ""}
                      size={14}
                    />
                  </FlatButton>

                  <FlatButton
                    variant={"yellow"}
                    disabled={pristine}
                    onClick={() => {
                      sendAlert({
                        type: "success",
                        content: "Copied to clipboard!",
                      });
                      void writeText(gm.trim());
                    }}
                  >
                    <Copy size={14} />
                  </FlatButton>
                </div>

                <div className="flex flex-1 items-center justify-center border-x border-x-zinc-900/30 font-mono text-xs"></div>

                <FlatButton
                  variant={"red"}
                  className="rounded-br-sm"
                  disabled={pristine}
                  onClick={() => {
                    rerollGreeting();
                    setYesterday("");
                    setToday("");
                  }}
                >
                  <TriangleAlert size={14} />
                </FlatButton>
              </div>
            </div>
          </div>
        ) : null
      }
    />
  );
};
