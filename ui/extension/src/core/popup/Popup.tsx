import { Route, Routes, useLocation } from "react-router-dom";

import { RootLayout } from "./Layout";
import { LoginPage } from "./pages/auth/login/Login";
import { SignupPage } from "./pages/auth/signup/Signup";
import { HomePage } from "./pages/home/HomePage";
import { CreateNotePage } from "./pages/notes/create/CreateNotePage";
import { ViewNotePage } from "./pages/notes/view/ViewNotePage";

export const Popup = () => {
  const location = useLocation();

  const overwriteLocation: undefined | string = undefined;

  return (
    <Routes location={overwriteLocation ?? location.pathname}>
      <Route path="/" element={<RootLayout />}>
        {/* <Route path="/" element={<AppLayout />}> */}
        <Route index element={<HomePage />} />
        <Route path="/notes">
          <Route path="/notes/create" element={<CreateNotePage />} />
          <Route path="/notes/view/:id" element={<ViewNotePage />} />
        </Route>
        {/* </Route> */}

        <Route path="/auth">
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/sign-up" element={<SignupPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
