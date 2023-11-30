import { Route, Routes, useLocation } from "react-router-dom";

import { HomePage } from "./pages/home/HomePage";
import { LoginPage } from "./pages/login/Login";

export const Popup = () => {
  const location = useLocation();

  return (
    <Routes location={"/login" ?? location.pathname}>
      <Route path="/">
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
    </Routes>
  );
};
