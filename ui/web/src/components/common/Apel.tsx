/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const TheGame = () => {
  const [timer, setTimer] = useState(0);
  const [isCongratsShown, setCongratsShown] = useState(false);

  // increate timer every second, if timer is 3, redirect to https://og.ax
  useEffect(() => {
    if (timer < 4 && !isCongratsShown) {
      const interval = setInterval(() => {
        setTimer((previous) => previous + 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      window.location.href = "https://og.ax";
    }
  }, [timer, isCongratsShown]);

  const handleAppleClick = () => {
    if (timer === 3) {
      alert("Congratulations! You are certified pro gamer.");
      setCongratsShown(true);
    } else {
      window.location.href = "https://og.ax";
    }
  };

  return (
    <>
      <Dialog defaultOpen>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Press the apple at 3 seconds!</DialogTitle>
            <DialogDescription>Timer: {timer} seconds</DialogDescription>
          </DialogHeader>
          <div className="flex h-32 items-center justify-center">
            <img
              src="/other/apel.png"
              alt="Apple"
              // always spinning
              className="w-32 h-32 animate-spin"
              onClick={handleAppleClick}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const ApelEasterEgg = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // if following keys are pressed in order, show the easter egg [a,p,e,l]
    const keys = ["a", "p", "e", "l"];
    const pressed: string[] = [];

    const handleKeyDown = (event: KeyboardEvent) => {
      pressed.push(event.key);

      if (pressed.length > keys.length) {
        pressed.shift();
      }

      if (pressed.join("") === keys.join("")) {
        setIsVisible(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isVisible) return <TheGame />;

  return <></>;
};
