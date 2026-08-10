"use client";

import { useEffect } from "react";

const SECTIONS = ["welcome", "portfolio"] as const;

function jumpTo(id: (typeof SECTIONS)[number]) {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

/**
 * One mouse-wheel flick teleports between welcome ↔ portfolio.
 * Inside portfolio, normal scroll still works when content overflows.
 */
export default function PageTeleportScroll() {
  useEffect(() => {
    let locked = false;
    let unlockTimer = 0;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 10) return;
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
      if (locked) {
        e.preventDefault();
        return;
      }

      const welcome = document.getElementById("welcome");
      const portfolio = document.getElementById("portfolio");
      if (!welcome || !portfolio) return;

      const y = window.scrollY;
      const onWelcome = y < welcome.offsetHeight * 0.55;
      const portfolioTop = portfolio.offsetTop;
      const nearPortfolioTop = y >= portfolioTop - 8 && y < portfolioTop + 80;

      // Welcome → portfolio (teleport)
      if (onWelcome && e.deltaY > 0) {
        e.preventDefault();
        locked = true;
        jumpTo("portfolio");
        unlockTimer = window.setTimeout(() => {
          locked = false;
        }, 900);
        return;
      }

      // Portfolio top → welcome (teleport)
      if (nearPortfolioTop && e.deltaY < 0) {
        e.preventDefault();
        locked = true;
        jumpTo("welcome");
        unlockTimer = window.setTimeout(() => {
          locked = false;
        }, 900);
        return;
      }

      // Otherwise let the browser scroll the portfolio content normally
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(unlockTimer);
    };
  }, []);

  return null;
}
