import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Provider } from "./context";

import "./main.css";
import './i18n';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>
);
