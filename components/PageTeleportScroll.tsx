"use client";

import { useEffect } from "react";

const SECTIONS = ["welcome", "terminal", "portfolio"] as const;
type SectionId = (typeof SECTIONS)[number];

const GESTURE_GAP_MS = 220;
const ARRIVE_PAD_PX = 64;
const PORTFOLIO_TOP_SLACK = 48;
const WHEEL_THRESHOLD = 10;
const MAX_ANIM_MS = 1400;

function scrollY() {
  return window.scrollY || document.documentElement.scrollTop || 0;
}

function sectionEl(id: SectionId) {
  return document.getElementById(id);
}

function jumpTo(id: SectionId) {
  const el = sectionEl(id);
  if (!el) return;
  window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
}

/** Section that owns the top of the viewport. */
function currentSectionIndex(): number {
  const y = scrollY() + 8;

  for (let i = SECTIONS.length - 1; i >= 0; i -= 1) {
    const el = sectionEl(SECTIONS[i]);
    if (!el) continue;
    if (y >= el.offsetTop - 2) return i;
  }
  return 0;
}

function nearSection(id: SectionId, pad = ARRIVE_PAD_PX) {
  const el = sectionEl(id);
  if (!el) return false;
  return Math.abs(scrollY() - el.offsetTop) <= pad;
}

function hostCanScroll(host: HTMLElement, deltaY: number) {
  const { scrollTop, scrollHeight, clientHeight } = host;
  if (scrollHeight <= clientHeight + 2) return false;
  if (deltaY < 0 && scrollTop > 1) return true;
  if (deltaY > 0 && scrollTop + clientHeight < scrollHeight - 2) return true;
  return false;
}

/**
 * One physical wheel/swipe gesture moves exactly one page:
 * welcome → terminal → portfolio (and reverse).
 */
export default function PageTeleportScroll() {
  useEffect(() => {
    let animating = false;
    let gestureConsumed = false;
    let lastEventAt = 0;
    let lastDir: 1 | -1 | 0 = 0;
    let arriveTimer = 0;
    let safetyTimer = 0;
    let touchAnchorY = 0;

    const clearArriveWatch = () => {
      window.clearInterval(arriveTimer);
      window.clearTimeout(safetyTimer);
      arriveTimer = 0;
      safetyTimer = 0;
    };

    const finishAnimation = () => {
      animating = false;
      clearArriveWatch();
    };

    const watchArrive = (id: SectionId) => {
      clearArriveWatch();
      arriveTimer = window.setInterval(() => {
        if (nearSection(id)) finishAnimation();
      }, 48);
      safetyTimer = window.setTimeout(finishAnimation, MAX_ANIM_MS);
    };

    const beginGestureWindow = (dir: 1 | -1) => {
      const now = performance.now();
      if (now - lastEventAt > GESTURE_GAP_MS || dir !== lastDir) {
        gestureConsumed = false;
      }
      lastEventAt = now;
      lastDir = dir;
    };

    const tryTeleport = (dir: 1 | -1) => {
      if (animating || gestureConsumed) return false;

      const idx = currentSectionIndex();
      const next = idx + dir;
      if (next < 0 || next >= SECTIONS.length) return false;

      const portfolio = sectionEl("portfolio");
      const y = scrollY();

      // Portfolio keeps native document scroll until its top edge.
      if (SECTIONS[idx] === "portfolio" && portfolio) {
        if (dir === 1) return false;
        if (y > portfolio.offsetTop + PORTFOLIO_TOP_SLACK) return false;
      }

      const target = SECTIONS[next];
      gestureConsumed = true;
      animating = true;
      jumpTo(target);
      watchArrive(target);
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      beginGestureWindow(dir);

      const scrollHost = (e.target as HTMLElement | null)?.closest?.(
        "[data-terminal-scroll]",
      ) as HTMLElement | null;

      if (scrollHost && hostCanScroll(scrollHost, e.deltaY)) {
        return;
      }

      // Eat inertia while animating or after this gesture already moved a page.
      if (animating || gestureConsumed) {
        e.preventDefault();
        return;
      }

      const idx = currentSectionIndex();
      const portfolio = sectionEl("portfolio");
      const y = scrollY();

      if (SECTIONS[idx] === "portfolio" && portfolio) {
        if (dir === 1) return;
        if (y > portfolio.offsetTop + PORTFOLIO_TOP_SLACK) return;
      }

      if (dir === -1 && idx === 0) return;
      if (dir === 1 && idx === SECTIONS.length - 1) return;

      e.preventDefault();
      tryTeleport(dir);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchAnchorY = e.touches[0]?.clientY ?? 0;
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (animating) return;
      const endY = e.changedTouches[0]?.clientY ?? touchAnchorY;
      const delta = touchAnchorY - endY;
      if (Math.abs(delta) < 56) return;

      const dir: 1 | -1 = delta > 0 ? 1 : -1;
      beginGestureWindow(dir);

      const target = e.target as HTMLElement | null;
      const scrollHost = target?.closest?.(
        "[data-terminal-scroll]",
      ) as HTMLElement | null;
      if (scrollHost && hostCanScroll(scrollHost, dir * 40)) return;

      tryTeleport(dir);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      clearArriveWatch();
    };
  }, []);

  return null;
}
