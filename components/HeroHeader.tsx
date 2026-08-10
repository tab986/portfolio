export default function HeroHeader() {
  return (
    <header className="relative z-10 max-w-xl">
      <p className="animate-fade-up font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-chrome sm:text-xs">
        <span className="text-warm-white">Abdalrhmn Anwar</span>
        <span className="mx-2 text-chrome-dim">|</span>
        <span>Full Stack Developer · Baghdad</span>
      </p>

      <h1 className="animate-fade-up-delay-1 mt-6 font-sans text-[clamp(1.9rem,4.4vw,3.35rem)] font-semibold leading-[1.08] tracking-tight text-warm-white">
        Architecting Scalable Backend Systems &amp; Full-Stack Applications.
      </h1>

      <p className="animate-fade-up-delay-1 mt-5 font-sans text-sm font-medium tracking-wide text-chrome sm:text-[15px]">
        Abdalrhmn Anwar | Computer Engineering Technology (MTU)
      </p>

    </header>
  );
}
