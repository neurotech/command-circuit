import { format } from "date-fns";
import { compareAsc } from "date-fns/compareAsc";
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import type { HistoryItem } from "../features/clipboard-watcher/history-panel";
import { useConfig } from "../hooks/useConfig";
import { useToggle } from "../hooks/useToggle";

type ConfigValidationSchema = {
  credentials: {
    github: boolean;
    linear: boolean;
    valid: boolean;
  };
};

type Credentials = {
  github: string | undefined;
  linear: string | undefined;
};

type ConfigContextType = {
  loading: boolean;

  configDialogOpen: boolean;
  toggleConfigDialog: () => void;

  configValidation: ConfigValidationSchema;
  validateConfig: () => void;

  credentials: Credentials;
  saveCredentials: (credentials: Credentials) => Promise<void>;
  getCredentials: () => Promise<void>;

  todayIsLater: boolean;

  clipboardHistory: HistoryItem[];
  refreshClipboardHistory: () => Promise<void>;

  debugMode: boolean;
  toggleDebugMode: () => void;

  discordTimestampVisible: boolean;
  toggleDiscordTimestampVisible: () => void;

  fancyTextVisible: boolean;
  toggleFancyTextVisible: () => void;
};

const defaultValues = {
  loading: false,
  configDialogOpen: false,
  toggleConfigDialog: () => {},
  configValidation: {
    credentials: {
      github: true,
      linear: true,
      valid: true,
    },
  },
  validateConfig: () => {},
  credentials: {
    github: undefined,
    linear: undefined,
  },
  saveCredentials: async () => {},
  getCredentials: async () => {},

  todayIsLater: false,

  clipboardHistory: [],
  refreshClipboardHistory: async () => {},

  debugMode: false,
  toggleDebugMode: () => {},

  discordTimestampVisible: false,
  toggleDiscordTimestampVisible: () => {},

  fancyTextVisible: false,
  toggleFancyTextVisible: () => {},
};

export const ConfigContext = createContext<ConfigContextType>(defaultValues);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const { get, update } = useConfig();

  const [loading, setLoading] = useState(defaultValues.loading);
  const [debugMode, toggleDebugMode] = useToggle("debug-mode", false);
  const [discordTimestampVisible, toggleDiscordTimestampVisible] = useToggle(
    "discord-timestamp-visible",
    false,
  );
  const [fancyTextVisible, toggleFancyTextVisible] = useToggle(
    "fancy-text-visible",
    false,
  );

  const [configDialogOpen, setConfigDialogOpen] = useState(
    defaultValues.configDialogOpen,
  );
  const [configValidation, setConfigValidation] = useState(
    defaultValues.configValidation,
  );
  const [credentials, setCredentials] = useState<Credentials>(
    defaultValues.credentials,
  );
  const [clipboardHistory, setClipboardHistory] = useState<HistoryItem[]>(
    defaultValues.clipboardHistory,
  );

  const [todayIsLater, setTodayIsLater] = useState(defaultValues.todayIsLater);

  const toggleConfigDialog = useCallback(() => {
    setConfigDialogOpen((prev) => !prev);
  }, []);

  const validateConfig = useCallback(async () => {
    const isGitHubValid =
      credentials.github !== undefined && credentials.github !== "";
    const isLinearValid =
      credentials.linear !== undefined && credentials.linear !== "";

    setConfigValidation({
      credentials: {
        github: isGitHubValid,
        linear: isLinearValid,
        valid: isGitHubValid && isLinearValid,
      },
    });
  }, [credentials]);

  const getCredentials = useCallback(async () => {
    setLoading(true);
    const githubApiKey = (await get<string>("github-api-key")) || "";
    const linearApiKey = (await get<string>("linear-api-key")) || "";
    setLoading(false);

    setCredentials({
      github: githubApiKey,
      linear: linearApiKey,
    });
  }, [get]);

  const saveCredentials = useCallback(
    async ({ github, linear }: Credentials) => {
      setLoading(true);
      await update("github-api-key", github);
      await update("linear-api-key", linear);
      setLoading(false);
    },
    [update],
  );

  const computeTodayIsLater = useCallback(async () => {
    const existing = (await get<string>("today")) || "";

    if (existing !== "") {
      const now = format(new Date(), "yyyy-MM-dd");
      const isLater = compareAsc(new Date(), new Date(existing)) === 1;

      setTodayIsLater(isLater);
      await update("today", now);
    } else {
      setTodayIsLater(false);
    }
  }, [get, update]);

  const refreshClipboardHistory = useCallback(async () => {
    const history = (await get<HistoryItem[]>("clipboard-history")) || [];
    setClipboardHistory(history);
  }, [get]);

  useEffect(() => {
    getCredentials();
  }, [getCredentials]);

  useEffect(() => {
    validateConfig();
  }, [validateConfig]);

  useEffect(() => {
    computeTodayIsLater();
  }, [computeTodayIsLater]);

  useEffect(() => {
    refreshClipboardHistory();
  }, [refreshClipboardHistory]);

  return (
    <ConfigContext
      value={{
        configDialogOpen,
        toggleConfigDialog,
        configValidation,
        validateConfig,
        credentials,
        saveCredentials,
        getCredentials,
        loading,
        todayIsLater,
        clipboardHistory,
        refreshClipboardHistory,
        debugMode,
        toggleDebugMode,
        discordTimestampVisible,
        toggleDiscordTimestampVisible,
        fancyTextVisible,
        toggleFancyTextVisible,
      }}
    >
      {children}
    </ConfigContext>
  );
};
