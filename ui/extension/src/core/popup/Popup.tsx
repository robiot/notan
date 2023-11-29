import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { HomePage } from "./pages/home/HomePage";

export const Popup = () => {
  return (
    <BrowserRouter>
      <Routes
      // location={}
      >
        <Route path="/">
          {/* element={<div />} <Slot /> */}
          <Route index element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
