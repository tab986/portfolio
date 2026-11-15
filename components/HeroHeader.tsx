import Image from "next/image";
import { FileDown } from "lucide-react";
import ContactLinks from "@/components/ContactLinks";
import { CV_FILENAME, CV_HREF, TELEGRAM_HANDLE, TELEGRAM_HREF } from "@/lib/site";

export default function HeroHeader() {
  return (
    <header className="relative z-10 w-full max-w-xl min-w-0">
      <p className="animate-fade-up font-sans text-[10px] font-medium uppercase leading-relaxed tracking-[0.14em] text-chrome sm:text-[11px] sm:tracking-[0.22em] sm:text-xs">
        <span className="text-warm-white">Abdalrhmn Anwar</span>
        <span className="mx-1.5 text-chrome-dim sm:mx-2">|</span>
        <span className="inline">Full-Stack Developer · Baghdad</span>
      </p>

      <h2 className="animate-fade-up-delay-1 mt-4 break-words font-sans text-[clamp(1.55rem,7.2vw,3.35rem)] font-semibold leading-[1.12] tracking-tight text-warm-white sm:mt-6 sm:text-[clamp(1.9rem,4.4vw,3.35rem)] sm:leading-[1.08]">
        Building and shipping production web and mobile applications, end to end.
      </h2>

      <p className="animate-fade-up-delay-1 mt-4 hidden font-sans text-sm font-medium leading-relaxed tracking-wide text-chrome sm:mt-5 sm:text-[15px] lg:block">
        Abdalrhmn Anwar | Computer Engineering Technology (MTU)
      </p>

      {/* Phones and tablets: a flat ID badge instead of the 3D lanyard card. */}
      <div className="animate-fade-up-delay-1 mt-5 flex items-center gap-4 lg:hidden">
        <div className="id-badge relative w-[5.25rem] shrink-0 pt-4 sm:w-24">
          <span
            aria-hidden
            className="absolute left-1/2 top-0 h-6 w-2.5 -translate-x-1/2 rounded-sm bg-gradient-to-b from-zinc-700 to-zinc-900"
          />
          <span
            aria-hidden
            className="absolute left-1/2 top-3 z-10 h-3.5 w-5 -translate-x-1/2 rounded-[3px] border-2 border-zinc-400 bg-obsidian"
          />
          <Image
            src="/assets/card-front.webp"
            alt="Abdalrhmn Anwar"
            width={320}
            height={513}
            unoptimized
            className="relative block h-auto w-full rounded-md border-2 border-zinc-300/90 shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
          />
        </div>
        <div className="min-w-0">
          <p className="font-sans text-base font-semibold leading-snug text-warm-white">
            Abdalrhmn Anwar
          </p>
          <p className="mt-1 font-sans text-sm leading-relaxed text-chrome">
            Computer Engineering Technology (MTU)
          </p>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-chrome-dim">
            Baghdad, Iraq
          </p>
        </div>
      </div>

      <div className="animate-fade-up-delay-2 mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-stretch">
        <a
          href={TELEGRAM_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="tap-target glow-gold inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 bg-gold px-5 py-3.5 text-center font-sans text-sm font-semibold text-obsidian transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto sm:justify-start"
        >
          Telegram: {TELEGRAM_HANDLE}
        </a>

        <a
          href={CV_HREF}
          download={CV_FILENAME}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-panel group tap-target inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2.5 rounded-none border border-gold/35 px-5 py-3.5 font-sans text-sm font-semibold text-warm-white transition-[border-color,box-shadow,transform,color] duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold hover:shadow-[0_0_28px_rgba(212,175,55,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto sm:justify-start"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center border border-gold/40 bg-[var(--gold-soft)] text-gold transition-colors duration-300 group-hover:border-gold group-hover:bg-gold group-hover:text-obsidian">
            <FileDown
              className="h-3.5 w-3.5"
              aria-hidden
              suppressHydrationWarning
            />
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span>Download CV</span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-chrome-dim transition-colors group-hover:text-gold/80">
              PDF · Resume
            </span>
          </span>
        </a>
      </div>

      <ContactLinks className="animate-fade-up-delay-2 mt-4" />
    </header>
  );
}
