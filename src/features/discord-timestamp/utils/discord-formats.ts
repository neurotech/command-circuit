import { format, formatDistanceToNow, getUnixTime } from "date-fns";

export type DiscordFormat = {
  code: string;
  label: string;
  getPreview: (date: Date) => string;
  className?: string;
};

export const DISCORD_FORMATS: DiscordFormat[] = [
  {
    code: "t",
    label: "Short time",
    getPreview: (date) => format(date, "h:mm a"),
    className: "rounded-tl-sm",
  },
  {
    code: "T",
    label: "Long time",
    getPreview: (date) => format(date, "h:mm:ss a"),
  },
  {
    code: "R",
    label: "Relative",
    getPreview: (date) => formatDistanceToNow(date, { addSuffix: true }),
    className: "rounded-tr-sm",
  },
  {
    code: "D",
    label: "Long date",
    getPreview: (date) => format(date, "MMMM d, yyyy"),
    className: "rounded-bl-sm",
  },
  {
    code: "f",
    label: "Short datetime",
    getPreview: (date) => format(date, "MMMM d, yyyy h:mm a"),
  },
  {
    code: "F",
    label: "Long datetime",
    getPreview: (date) => format(date, "EEEE, MMMM d, yyyy h:mm a"),
    className: "rounded-br-sm",
  },
];

export const getDiscordTimestamp = (date: Date, code: string): string => {
  const unix = getUnixTime(date);
  return `<t:${unix}:${code}>`;
};
