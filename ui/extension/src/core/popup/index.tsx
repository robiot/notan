import "@assets/style/font.css";
import "./styles/index.css";

import { Popup } from "@root/src/core/popup/Popup";
import React from "react";
import { createRoot } from "react-dom/client";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

refreshOnUpdate("core/popup");

function init() {
  const appContainer = document.querySelector("#app");

  if (!appContainer) {
    throw new Error("Can not find #app");
  }

  const root = createRoot(appContainer);

  root.render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>,
  );
}

init();
