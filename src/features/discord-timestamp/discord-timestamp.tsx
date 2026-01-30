import { format } from "date-fns";
import { Clock, Eye, EyeClosed, RotateCcw } from "lucide-react";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { TextInput } from "../../components/ui/text-input";
import { ConfigContext } from "../../context/config-context";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { TimestampFormatRow } from "./components/timestamp-format-row";
import { DISCORD_FORMATS, getDiscordTimestamp } from "./utils/discord-formats";

export const DiscordTimestamp = () => {
  const { discordTimestampVisible, toggleDiscordTimestampVisible } =
    use(ConfigContext);
  const { copy } = useCopyToClipboard();
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
    void copy(timestamp, `Copied ${timestamp} to clipboard!`);
  };

  return (
    <Card
      header="Discord Timestamp"
      headerIcon={<Clock size={16} />}
      headerRight={
        <div className="flex gap-1">
          <Button small onClick={setToNow} aria-label="Reset to current time">
            <RotateCcw size={14} />
          </Button>
          <Button
            small
            onClick={toggleDiscordTimestampVisible}
            aria-label={discordTimestampVisible ? "Hide widget" : "Show widget"}
          >
            {discordTimestampVisible ? (
              <Eye size={14} />
            ) : (
              <EyeClosed size={14} />
            )}
          </Button>
        </div>
      }
      hideContent={!discordTimestampVisible}
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
          <div className="grid select-none grid-flow-dense grid-cols-3 gap-px rounded-sm border border-zinc-900">
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
