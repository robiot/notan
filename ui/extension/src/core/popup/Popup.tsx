import { Route, Routes, useLocation } from "react-router-dom";

import { RootLayout } from "./Layout";
import { LoginPage } from "./pages/auth/Login";
import { HomePage } from "./pages/home/HomePage";
import { CreateNotePage } from "./pages/notes/create/CreateNotePage";
import { ViewNotePage } from "./pages/notes/view/ViewNotePage";

export const Popup = () => {
  const location = useLocation();

  // const overwriteLocation: undefined | string = "/notes/create";
  const overwriteLocation: undefined | string = undefined;

  return (
    <Routes location={overwriteLocation ?? location.pathname}>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/notes">
          <Route path="/notes/create" element={<CreateNotePage />} />
          <Route path="/notes/view/:id" element={<ViewNotePage />} />
        </Route>

        <Route path="/auth">
          <Route path="/auth/login" element={<LoginPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
