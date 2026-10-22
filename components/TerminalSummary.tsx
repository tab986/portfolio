/** Facts taken from the CV. No year-count or project total is stated there. */
const FACTS = [
  {
    label: "Work",
    value: "Full-Stack Developer, Freelance / Projects · 2025–Present",
  },
  {
    label: "Internship",
    value: "Backend Intern, GDG · 05/2025–08/2025",
  },
  {
    label: "Education",
    value: "Computer Engineering Technology, MTU · 2023–2027",
  },
  {
    label: "Shipping",
    value: "Google Play and the App Store",
  },
] as const;

const STACK = ["Next.js", "Node.js", "Flutter", "PostgreSQL", "Cloudflare Workers"] as const;

export default function TerminalSummary() {
  return (
    <aside aria-label="Quick summary" className="glass-panel min-w-0 rounded-lg p-4 sm:p-5">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-gold">
        At a glance
      </p>
      <p className="mt-3 font-sans text-[0.95rem] leading-relaxed text-warm-white sm:text-base">
        Full-Stack Developer in Baghdad, shipping production web and mobile apps from database
        design and APIs to the interface.
      </p>
      <dl className="mt-4 space-y-2.5">
        {FACTS.map((fact) => (
          <div key={fact.label} className="min-w-0">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-chrome-dim">
              {fact.label}
            </dt>
            <dd className="mt-0.5 font-sans text-sm leading-snug text-warm-white">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-chrome-dim">
        Core stack
      </p>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {STACK.map((chip) => (
          <li
            key={chip}
            className="rounded-full border border-gold/35 px-2.5 py-1 font-mono text-[11px] text-gold"
          >
            {chip}
          </li>
        ))}
      </ul>
    </aside>
  );
}
