import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

import { LoginContext } from "./components/context/LoginContext";
import { Toaster } from "./components/ui/toaster";
// Create a client
const queryClient = new QueryClient();

export const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginContext>
        <Outlet />
        <Toaster />
      </LoginContext>
    </QueryClientProvider>
  );
};
