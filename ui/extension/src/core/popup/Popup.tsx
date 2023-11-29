import { Route, Routes, useLocation } from "react-router-dom";

import { HomePage } from "./pages/home/HomePage";

export const Popup = () => {
  const location = useLocation();

  return (
    <Routes location={location.pathname}>
      <Route path="/">
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  );
};
