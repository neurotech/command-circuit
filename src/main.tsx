import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { AlertProvider } from "./context/alert-context";
import { ConfigProvider } from "./context/config-context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider>
      <AlertProvider>
        <App />
      </AlertProvider>
    </ConfigProvider>
  </React.StrictMode>,
);
