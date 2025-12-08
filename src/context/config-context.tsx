import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useConfig } from "../hooks/useConfig";

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
};

export const ConfigContext = createContext<ConfigContextType>(defaultValues);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const { get, update } = useConfig();

  const [loading, setLoading] = useState(defaultValues.loading);

  const [configDialogOpen, setConfigDialogOpen] = useState(
    defaultValues.configDialogOpen,
  );
  const [configValidation, setConfigValidation] = useState(
    defaultValues.configValidation,
  );
  const [credentials, setCredentials] = useState<Credentials>(
    defaultValues.credentials,
  );

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

  useEffect(() => {
    getCredentials();
  }, [getCredentials]);

  useEffect(() => {
    validateConfig();
  }, [validateConfig]);

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
      }}
    >
      {children}
    </ConfigContext>
  );
};
