import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet } from "react-router-dom";

import { LoginContext } from "./components/context/LoginContext";
import { UpdateContext } from "./components/context/UpdateContext";
import { Toaster } from "./components/ui/toaster";
import { enviroment } from "./lib/enviroment";

// Create a client
const queryClient = new QueryClient();

export const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LoginContext>
        <UpdateContext />
        <Outlet />
        <Toaster />
        {enviroment.API_URL!.includes("localhost") && (
          <div className="fixed bottom-0 right-0 z-50 p-2 text-xs text-white bg-destructive rounded-bl-md">
            {enviroment.API_URL}
          </div>
        )}
      </LoginContext>
    </QueryClientProvider>
  );
};
