import { FileDown } from "lucide-react";

const CV_HREF = "/cv/abdalrhmn-anwar-cv.pdf";

export default function HeroHeader() {
  return (
    <header className="relative z-10 w-full max-w-xl min-w-0">
      <p className="animate-fade-up font-sans text-[10px] font-medium uppercase leading-relaxed tracking-[0.14em] text-chrome sm:text-[11px] sm:tracking-[0.22em] sm:text-xs">
        <span className="text-warm-white">Abdalrhmn Anwar</span>
        <span className="mx-1.5 text-chrome-dim sm:mx-2">|</span>
        <span className="inline">Full Stack Developer · Baghdad</span>
      </p>

      <h1 className="animate-fade-up-delay-1 mt-4 break-words font-sans text-[clamp(1.55rem,7.2vw,3.35rem)] font-semibold leading-[1.12] tracking-tight text-warm-white sm:mt-6 sm:text-[clamp(1.9rem,4.4vw,3.35rem)] sm:leading-[1.08]">
        Architecting Scalable Backend Systems &amp; Full-Stack Applications.
      </h1>

      <p className="animate-fade-up-delay-1 mt-4 font-sans text-sm font-medium leading-relaxed tracking-wide text-chrome sm:mt-5 sm:text-[15px]">
        Abdalrhmn Anwar | Computer Engineering Technology (MTU)
      </p>

      <div className="animate-fade-up-delay-2 mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-stretch">
        <a
          href="https://t.me/o_xdv"
          target="_blank"
          rel="noopener noreferrer"
          className="tap-target glow-gold inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 bg-gold px-5 py-3.5 text-center font-sans text-sm font-semibold text-obsidian transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:w-auto sm:justify-start"
        >
          Telegram: @o_xdv
        </a>

        <a
          href={CV_HREF}
          download="Abdalrhmn-Anwar-CV.pdf"
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
    </header>
  );
}
