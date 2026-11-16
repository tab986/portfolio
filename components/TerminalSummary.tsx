"use client";

import { useLang } from "@/lib/i18n";

const STACK = ["Next.js", "Node.js", "Flutter", "PostgreSQL", "Cloudflare Workers"] as const;

/** Facts taken from the CV. No year-count or project total is stated there. */
export default function TerminalSummary() {
  const { t, dir } = useLang();

  const facts = [
    { label: t.about.work, value: t.about.workValue },
    { label: t.about.internship, value: t.about.internshipValue },
    { label: t.about.education, value: t.about.educationValue },
    { label: t.about.shipping, value: t.about.shippingValue },
  ];

  return (
    <aside dir={dir} aria-labelledby="about-heading" className="glass-panel min-w-0 rounded-lg p-4 sm:p-5">
      <h2
        id="about-heading"
        className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-gold"
      >
        {t.about.label}
      </h2>
      <p className="mt-3 font-sans text-[0.95rem] leading-relaxed text-warm-white sm:text-base">
        {t.about.lead}
      </p>
      <dl className="mt-4 space-y-2.5">
        {facts.map((fact) => (
          <div key={fact.label} className="min-w-0">
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-chrome-dim">
              {fact.label}
            </dt>
            <dd className="mt-0.5 font-sans text-sm leading-snug text-warm-white">{fact.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-chrome-dim">
        {t.about.stack}
      </p>
      <ul dir="ltr" className="mt-2 flex flex-wrap gap-1.5 rtl:justify-end">
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
