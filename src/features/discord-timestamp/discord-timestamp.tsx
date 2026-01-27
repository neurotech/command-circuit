import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { format } from "date-fns";
import { Clock, RotateCcw } from "lucide-react";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { TextInput } from "../../components/ui/text-input";
import { AlertContext } from "../../context/alert-context";
import { TimestampFormatRow } from "./components/timestamp-format-row";
import { DISCORD_FORMATS, getDiscordTimestamp } from "./utils/discord-formats";

export const DiscordTimestamp = () => {
  const { sendAlert } = use(AlertContext);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const setToNow = useCallback(() => {
    const now = new Date();
    setSelectedDate(format(now, "yyyy-MM-dd"));
    setSelectedTime(format(now, "HH:mm"));
  }, []);

  useEffect(() => {
    setToNow();
  }, [setToNow]);

  const selectedDateTime = useMemo(() => {
    if (!selectedDate || !selectedTime) return null;
    return new Date(`${selectedDate}T${selectedTime}`);
  }, [selectedDate, selectedTime]);

  const handleCopy = (code: string) => {
    if (!selectedDateTime) return;
    const timestamp = getDiscordTimestamp(selectedDateTime, code);
    void writeText(timestamp);
    sendAlert({
      type: "success",
      content: `Copied ${timestamp} to clipboard!`,
    });
  };

  return (
    <Card
      header="Discord Timestamp"
      headerIcon={<Clock size={16} />}
      headerRight={
        <Button small onClick={setToNow}>
          <RotateCcw size={14} />
        </Button>
      }
      content={
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <TextInput
              label="Date"
              type="date"
              valid
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                e.target.blur();
              }}
            />
            <TextInput
              label="Time"
              type="time"
              valid
              value={selectedTime}
              onChange={(e) => {
                setSelectedTime(e.target.value);
              }}
            />
          </div>
          <div className="grid grid-flow-dense grid-cols-3 gap-px rounded-sm border border-zinc-900">
            {selectedDateTime &&
              DISCORD_FORMATS.map((fmt) => (
                <TimestampFormatRow
                  key={fmt.code}
                  preview={fmt.getPreview(selectedDateTime)}
                  onCopy={() => handleCopy(fmt.code)}
                  className={fmt.className}
                />
              ))}
          </div>
        </div>
      }
    />
  );
};
