import "@/assets/style/font.css";
import "./styles/index.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import refreshOnUpdate from "virtual:reload-on-update-in-view";

import { Popup } from "./Popup";

refreshOnUpdate("core/popup");

function init() {
  const appContainer = document.querySelector("#app");

  if (!appContainer) {
    throw new Error("Can not find #app");
  }

  const root = createRoot(appContainer);

  root.render(
    <React.StrictMode>
      <MemoryRouter>
        <Popup />
      </MemoryRouter>
    </React.StrictMode>,
  );
}

init();
