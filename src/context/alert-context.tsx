import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type AlertType = "success" | "error" | "warning" | "info";

export type AlertSchema = {
  type: AlertType;
  content: string;
  persist?: boolean;
};

type AlertContextType = {
  sendAlert: (alert: AlertSchema) => void;
  alert?: AlertSchema;
  active: boolean;
};

const defaultValues: AlertContextType = {
  sendAlert: () => {},
  active: false,
};

export const AlertContext = createContext<AlertContextType>(defaultValues);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertSchema>();
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const sendAlert = useCallback((alert: AlertSchema) => {
    if (activeRef.current) {
      setActive(false);

      setTimeout(() => {
        setAlert(alert);
        setActive(true);
      }, 600);
    } else {
      setAlert(alert);
      setActive(true);
    }
  }, []);

  useEffect(() => {
    if (active && alert) {
      const timeoutId = setTimeout(() => setActive(false), 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [active, alert]);

  return (
    <AlertContext.Provider value={{ sendAlert, alert, active }}>
      {children}
    </AlertContext.Provider>
  );
};
