"use client";

import { useEffect } from "react";

export default function UpgradePage() {
  // redirect to /?upgrade=true

  useEffect(() => {
    window.location.href = "/?upgrade=true";
  }, []);

  return null;
}
