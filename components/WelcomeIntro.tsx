"use client";

import type { MouseEvent } from "react";
import dynamic from "next/dynamic";
import { FileDown } from "lucide-react";
import HeroExperienceClient from "@/components/hero-3d/HeroExperienceClient";
import { useMediaQuery } from "@/components/hero-3d/useMediaQuery";
import { CONTACT_EMAIL, CV_FILENAME, CV_HREF } from "@/lib/site";

const HERO_TITLE = "welcome to Abdalrhmn portfolio";

const headlineClassName =
  "font-sans text-[clamp(1.65rem,8.2vw,4.75rem)] font-semibold leading-[1.08] tracking-tight text-warm-white sm:text-[clamp(2rem,5.5vw,4.75rem)] sm:leading-[1.05]";

// GSAP registers plugins at import time. Keep that off the Worker SSR graph.
const SplitText = dynamic(() => import("@/components/SplitText"), {
  ssr: false,
  loading: () => (
    <span aria-hidden="true" className={headlineClassName} style={{ textAlign: "left" }}>
      {HERO_TITLE}
    </span>
  ),
});

function teleportToTerminal(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const el = document.getElementById("terminal");
  if (!el) return;
  const root = document.scrollingElement || document.documentElement;
  root.scrollTo({ top: el.offsetTop, behavior: "smooth" });
}

export default function WelcomeIntro() {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <section
      id="welcome"
      aria-label="Welcome"
      className="relative z-10 flex h-svh min-h-[100dvh] w-full max-w-[100vw] flex-col overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_85%_65%_at_72%_42%,rgba(54,54,54,0.55),transparent_68%),radial-gradient(ellipse_55%_45%_at_18%_78%,rgba(212,175,55,0.05),transparent_62%),#1a1a1a]"
      />

      <div className="relative mx-auto grid h-full w-full max-w-[90rem] flex-1 grid-cols-1 content-start items-stretch gap-2 px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-[max(1.25rem,env(safe-area-inset-top))] sm:gap-4 sm:px-8 max-lg:grid-rows-[auto_minmax(0,1fr)] max-lg:content-stretch lg:grid-cols-12 lg:grid-rows-none lg:content-stretch lg:gap-6 lg:px-8 lg:pb-8 lg:pt-0 xl:gap-8 xl:px-12">
        <div className="relative z-20 flex shrink-0 flex-col justify-center pt-2 lg:col-span-4 lg:pt-0 xl:col-span-4">
          <div className="max-w-md lg:max-w-none">
            <h1 className={`${headlineClassName} relative`} style={{ textAlign: "left" }}>
              <span className="sr-only">{HERO_TITLE}</span>
              {reduceMotion ? (
                <span aria-hidden="true">{HERO_TITLE}</span>
              ) : (
                <SplitText
                  text={HERO_TITLE}
                  tag="span"
                  ariaHidden
                  className={headlineClassName}
                  delay={80}
                  duration={0.7}
                  ease="power3.out"
                  splitType="chars"
                  from={{ opacity: 0, y: 48 }}
                  to={{ opacity: 1, y: 0 }}
                  threshold={0.1}
                  rootMargin="-40px"
                  textAlign="left"
                  onLetterAnimationComplete={() => {}}
                />
              )}
            </h1>
            <p className="mt-3 max-w-sm font-sans text-[0.9375rem] leading-relaxed text-chrome sm:mt-6 sm:text-sm md:text-base">
              Flutter and full-stack developer building POS and mobile apps.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="tap-target glow-gold inline-flex min-h-11 cursor-pointer items-center justify-center bg-gold px-4 py-2.5 font-sans text-sm font-semibold text-obsidian transition-[box-shadow,transform] duration-300 motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Contact me
              </a>
              <a
                href={CV_HREF}
                download={CV_FILENAME}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel tap-target inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 border border-gold/35 px-4 py-2.5 font-sans text-sm font-semibold text-warm-white transition-[border-color,box-shadow,transform,color] duration-300 motion-safe:hover:-translate-y-0.5 hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                <FileDown className="h-3.5 w-3.5 text-gold" aria-hidden />
                Download CV
              </a>
            </div>
          </div>
        </div>

        <figure
          aria-label="3D workspace"
          className="relative min-h-0 w-full min-w-0 cursor-grab active:cursor-grabbing max-lg:h-full lg:col-span-8 lg:h-auto lg:min-h-0 xl:col-span-8"
        >
          <div className="welcome-room-stage absolute inset-0 overflow-hidden bg-transparent shadow-none lg:inset-y-0 lg:-right-8 lg:left-0 xl:-right-12">
            <HeroExperienceClient />
          </div>
        </figure>
      </div>

      <a
        href="#terminal"
        onClick={teleportToTerminal}
        className="tap-target absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-30 flex min-h-11 min-w-[4.5rem] -translate-x-1/2 cursor-pointer flex-col items-center justify-center gap-2 px-4 py-2 text-chrome transition-colors duration-300 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.28em]">
          Scroll
        </span>
        <span
          aria-hidden
          className="block h-8 w-px origin-top animate-scroll-line bg-gradient-to-b from-gold to-transparent"
        />
      </a>
    </section>
  );
}
