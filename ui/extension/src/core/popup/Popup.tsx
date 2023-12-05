import { Route, Routes, useLocation } from "react-router-dom";

import { RootLayout } from "./Layout";
import { LoginPage } from "./pages/auth/login/Login";
import { SignupPage } from "./pages/auth/signup/Signup";
import { HomePage } from "./pages/home/HomePage";
import { CreateNotePage } from "./pages/notes/create/CreateNotePage";
import { ViewNotePage } from "./pages/notes/view/ViewNotePage";
import { ProfileEmailPage } from "./pages/profile/email/ProfileEmailPage";
import { ProfileOverviewPage } from "./pages/profile/overview/ProfileOverviewPage";
import { ProfilePasswordPage } from "./pages/profile/password/ProfilePasswordPage";
import { ProfileUsernamePage } from "./pages/profile/username/ProfileUsernamePage";

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

        <Route path="/profile">
          <Route index element={<ProfileOverviewPage />} />
          <Route path="/profile/username" element={<ProfileUsernamePage />} />
          <Route path="/profile/email" element={<ProfileEmailPage />} />
          <Route path="/profile/password" element={<ProfilePasswordPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
