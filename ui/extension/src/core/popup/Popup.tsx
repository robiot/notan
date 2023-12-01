import { Route, Routes, useLocation } from "react-router-dom";

import { AppLayout } from "./components/app/AppLayout";
import { RootLayout } from "./Layout";
import { LoginPage } from "./pages/auth/login/Login";
import { HomePage } from "./pages/home/HomePage";

export const Popup = () => {
  const location = useLocation();

  return (
    <Routes location={location.pathname}>
      <Route path="/" element={<RootLayout />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="/auth">
          <Route path="/auth/login" element={<LoginPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
