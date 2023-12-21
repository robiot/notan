"use client";

import { ToastProvider } from "@notan/components/ui/toast";
import { Toaster } from "@notan/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";

const queryClient = new QueryClient();

export const RootProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastProvider />
      <Toaster />
    </QueryClientProvider>
  );
};
