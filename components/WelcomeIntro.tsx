"use client";

import type { MouseEvent } from "react";
import SplitText from "@/components/SplitText";

const handleAnimationComplete = () => {
  console.log("All letters have animated!");
};

function teleportToPortfolio(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  document
    .getElementById("portfolio")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function WelcomeIntro() {
  return (
    <section
      id="welcome"
      aria-label="Welcome"
      className="relative z-10 flex h-svh min-h-[100dvh] w-full flex-col items-center justify-center px-6"
    >
      <div className="flex max-w-5xl flex-col items-center text-center">
        <SplitText
          text="welcome to abdalrhman portfolio"
          className="font-sans text-[clamp(2.25rem,8vw,6.5rem)] font-semibold leading-[1.05] tracking-tight text-warm-white"
          delay={80}
          duration={0.7}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 48 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-40px"
          textAlign="center"
          onLetterAnimationComplete={handleAnimationComplete}
        />
      </div>

      <a
        href="#portfolio"
        onClick={teleportToPortfolio}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2 text-chrome transition-colors duration-300 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
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
