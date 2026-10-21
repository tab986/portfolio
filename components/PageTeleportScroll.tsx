"use client";

import { useEffect } from "react";

const SECTIONS = ["welcome", "terminal", "portfolio"] as const;
type SectionId = (typeof SECTIONS)[number];

const ARRIVE_PAD_PX = 80;
const PORTFOLIO_TOP_SLACK = 56;
const WHEEL_THRESHOLD = 12;
const MAX_ANIM_MS = 1200;
const COOLDOWN_MS = 320;
const TOUCH_MIN_PX = 60;
/** Snap only for mouse-style desktops. Phones, tablets, and touch screens scroll natively. */
const DESKTOP_SNAP_QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine)";

function scrollingRoot() {
  return document.scrollingElement || document.documentElement;
}

function scrollY() {
  return scrollingRoot().scrollTop || window.scrollY || 0;
}

function sectionEl(id: SectionId) {
  return document.getElementById(id);
}

function jumpTo(id: SectionId) {
  const el = sectionEl(id);
  if (!el) return;
  scrollingRoot().scrollTo({ top: el.offsetTop, behavior: "smooth" });
}

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
 * Desktop snap between welcome, terminal, and portfolio.
 * Narrow screens and touch devices keep native scrolling. Section animations
 * still start from their own intersection observers.
 * While a snap is animating, wheel inertia is eaten; after it lands (or times
 * out) scrolling works again. No permanent gesture lock.
 */
export default function PageTeleportScroll() {
  useEffect(() => {
    const desktopSnap = window.matchMedia(DESKTOP_SNAP_QUERY);
    let animating = false;
    let cooldownUntil = 0;
    let arriveTimer = 0;
    let safetyTimer = 0;
    let touchAnchorY = 0;
    let listening = false;

    const clearArriveWatch = () => {
      window.clearInterval(arriveTimer);
      window.clearTimeout(safetyTimer);
      arriveTimer = 0;
      safetyTimer = 0;
    };

    const finishAnimation = () => {
      animating = false;
      cooldownUntil = performance.now() + COOLDOWN_MS;
      clearArriveWatch();
    };

    const watchArrive = (id: SectionId) => {
      clearArriveWatch();
      arriveTimer = window.setInterval(() => {
        if (nearSection(id)) finishAnimation();
      }, 40);
      safetyTimer = window.setTimeout(finishAnimation, MAX_ANIM_MS);
    };

    const tryTeleport = (dir: 1 | -1) => {
      if (animating || performance.now() < cooldownUntil) return false;

      const idx = currentSectionIndex();
      const next = idx + dir;
      if (next < 0 || next >= SECTIONS.length) return false;

      const portfolio = sectionEl("portfolio");
      const y = scrollY();

      // Inside portfolio: native document scroll first.
      if (SECTIONS[idx] === "portfolio" && portfolio) {
        if (dir === 1) return false;
        if (y > portfolio.offsetTop + PORTFOLIO_TOP_SLACK) return false;
      }

      const target = SECTIONS[next];
      animating = true;
      jumpTo(target);
      watchArrive(target);
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;
      if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;

      const scrollHost = (e.target as HTMLElement | null)?.closest?.(
        "[data-terminal-scroll]",
      ) as HTMLElement | null;
      if (scrollHost && hostCanScroll(scrollHost, e.deltaY)) {
        return;
      }

      // Lock only while snapping or during post-snap cooldown.
      if (animating || performance.now() < cooldownUntil) {
        e.preventDefault();
        return;
      }

      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
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
      if (animating || performance.now() < cooldownUntil) return;

      const endY = e.changedTouches[0]?.clientY ?? touchAnchorY;
      const delta = touchAnchorY - endY;
      if (Math.abs(delta) < TOUCH_MIN_PX) return;

      const dir: 1 | -1 = delta > 0 ? 1 : -1;
      const target = e.target as HTMLElement | null;
      const scrollHost = target?.closest?.(
        "[data-terminal-scroll]",
      ) as HTMLElement | null;
      if (scrollHost && hostCanScroll(scrollHost, dir * 40)) return;

      tryTeleport(dir);
    };

    const stopListening = () => {
      if (!listening) return;
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      listening = false;
      animating = false;
      clearArriveWatch();
    };

    const syncSnap = () => {
      stopListening();
      if (!desktopSnap.matches) return;
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("touchend", onTouchEnd, { passive: true });
      listening = true;
    };

    syncSnap();
    desktopSnap.addEventListener("change", syncSnap);

    return () => {
      desktopSnap.removeEventListener("change", syncSnap);
      stopListening();
    };
  }, []);

  return null;
}
