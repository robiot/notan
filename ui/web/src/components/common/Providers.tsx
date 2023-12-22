"use client";

import { FC, ReactNode, useEffect } from "react";
import ReactGA from "react-ga";

ReactGA.initialize(process.env.NEXT_PUBLIC_GA_TRACKING_ID!);

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);

  return <>{children}</>;
};
