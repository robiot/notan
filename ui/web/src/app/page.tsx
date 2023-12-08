"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.href = "https://og.ax";
  }, []);

  return <div></div>;
}
