"use client";

import { ToastProvider } from "@notan/components/ui/toast";
import { Toaster } from "@notan/components/ui/toaster";
import * as Sentry from "@sentry/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";

import { enviroment } from "@/lib/enviroment";

const queryClient = new QueryClient();

// check if next is in development mode
if (process.env.NODE_ENV !== "development") {
  Sentry.init({
    dsn: enviroment.SENTRY_DSN,
    tracesSampleRate: 1,
    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    // tracePropagationTargets: [/^https:\/\/api\.notan\.ax/],
  });
}

export const RootProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastProvider />
      <Toaster />
    </QueryClientProvider>
  );
};
