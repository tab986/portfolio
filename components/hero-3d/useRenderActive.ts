"use client";

import { useEffect, useState } from "react";

/** True while the browser tab is in the foreground. */
export function useDocumentVisible() {
  const [visible, setVisible] = useState(
    () => typeof document === "undefined" || document.visibilityState !== "hidden",
  );

  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  return visible;
}

/**
 * True while `elementId` is on screen and the tab is visible.
 * Used to park WebGL frameloops instead of rendering offscreen.
 */
export function useSectionVisible(elementId: string) {
  const tabVisible = useDocumentVisible();
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = document.getElementById(elementId);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting && entry.intersectionRatio > 0);
      },
      { threshold: [0, 0.01, 0.2] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [elementId]);

  return onScreen && tabVisible;
}
