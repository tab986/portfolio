export default function ProjectCard() {
  return (
    <a
      href="https://gamewiseiq.com"
      target="_blank"
      rel="noopener noreferrer"
      className="glass-panel group tap-target block w-full max-w-full cursor-pointer rounded-lg p-4 transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_32px_rgba(212,175,55,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-chrome-dim">
            Featured Project
          </p>
          <h2 className="mt-2 break-words font-sans text-xl font-semibold tracking-tight text-warm-white transition-colors group-hover:text-gold sm:text-2xl">
            GamewiseIQ
          </h2>
          <p className="mt-1 break-all font-mono text-xs text-react">
            gamewiseiq.com
          </p>
        </div>
        <span
          aria-hidden
          className="mt-1 shrink-0 text-chrome-dim transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
        >
          ↗
        </span>
      </div>

      <span className="mt-4 inline-block max-w-full rounded-md border border-zinc-700/50 bg-zinc-900/80 px-2.5 py-1.5 font-sans text-[10px] font-medium uppercase leading-snug tracking-[0.12em] text-zinc-300">
        High-Availability Backend &amp; API Integration
      </span>
    </a>
  );
}
