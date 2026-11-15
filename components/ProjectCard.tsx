import {
  Building2,
  CalendarDays,
  ExternalLink,
  GraduationCap,
  Server,
  Store,
  type LucideIcon,
} from "lucide-react";

type ProjectLink = {
  label: string;
  href: string;
};

type Project = {
  name: string;
  /** What the project is, as titled on the CV. */
  kind?: string;
  role: string;
  summary: string;
  stack: string[];
  icon: LucideIcon;
  tone: string;
  href?: string;
  links?: ProjectLink[];
};

/** Same projects, order, roles and links as the CV. */
const PROJECTS: Project[] = [
  {
    name: "Coders Hub",
    kind: "Software Studio Website & Billing Platform",
    role: "Full-Stack Developer",
    summary:
      "Website for a Baghdad software studio, plus a billing platform that takes Wayl payments with signed webhook verification and automatically issues Ed25519-signed software licenses.",
    stack: ["Next.js", "Cloudflare Workers", "Wayl", "Ed25519", "PostgreSQL (Neon)"],
    icon: Building2,
    tone: "from-[#3a2f1c] to-[#1a1a1a]",
    href: "https://www.codershub.org",
  },
  {
    name: "TabibiQ",
    kind: "Medical Appointment Booking Platform",
    role: "Full-Stack Developer",
    summary:
      "Patients search doctors and clinics by specialty and location, book visits, and get reminders. Built the frontend and backend and owned the architecture end to end.",
    stack: ["Android", "iOS"],
    icon: CalendarDays,
    tone: "from-[#2a3340] to-[#1a1a1a]",
    links: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.tabibiq.app",
      },
      {
        label: "App Store",
        href: "https://apps.apple.com/iq/app/tabibiq/id6807596163",
      },
    ],
  },
  {
    name: "Teryaq",
    kind: "Point of Sale (POS) System",
    role: "Full-Stack Developer",
    summary:
      "Flutter point-of-sale app with Ed25519 licensing and Wayl payments on a Next.js billing site.",
    stack: ["Flutter", "Ed25519", "Wayl", "Next.js", "PostgreSQL", "Cloudflare Workers"],
    icon: Store,
    tone: "from-[#3a3424] to-[#1a1a1a]",
    href: "https://www.codershub.org/teryaq",
  },
  {
    name: "Hala Teacher",
    kind: "Educational Website",
    role: "Front-End Developer",
    summary:
      "Arabic RTL site for a 6th-preparatory English course, with plans, booklets, and exam resources.",
    stack: ["Arabic (RTL)", "Cloudflare Workers"],
    icon: GraduationCap,
    tone: "from-[#243038] to-[#1a1a1a]",
    href: "https://www.halateacher.workers.dev/",
  },
  {
    name: "GameWiseIQ",
    role: "Backend Developer",
    summary:
      "Backend built for high availability, data processing, and secure API integrations for thousands of active users.",
    stack: [],
    icon: Server,
    tone: "from-[#2c2838] to-[#1a1a1a]",
    href: "https://gamewiseiq.com",
  },
];

const cardClassName =
  "glass-panel group tap-target flex h-full w-full max-w-full flex-col overflow-hidden rounded-lg transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_32px_rgba(212,175,55,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

const linkClassName =
  "tap-target inline-flex min-h-11 items-center gap-1 rounded-sm font-mono text-xs text-react underline-offset-2 hover:text-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

function ProjectVisual({ project }: { project: Project }) {
  const Icon = project.icon;
  return (
    <div
      aria-hidden
      className={`relative hidden h-20 shrink-0 items-center justify-center bg-gradient-to-br lg:flex ${project.tone}`}
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-black/25 text-gold">
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );
}

function ProjectBody({ project }: { project: Project }) {
  const Icon = project.icon;
  return (
    <>
      <ProjectVisual project={project} />
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center gap-3">
          {/* Phones: icon chip beside the title instead of a full-width banner */}
          <span
            aria-hidden
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-gradient-to-br text-gold lg:hidden ${project.tone}`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-chrome">
              {project.role}
            </p>
            <h3 className="mt-1 break-words font-sans text-xl font-semibold tracking-tight text-warm-white transition-colors group-hover:text-gold sm:text-2xl lg:mt-2">
              {project.name}
            </h3>
          </div>
        </div>
        {project.kind ? (
          <p className="mt-2 font-sans text-xs font-medium leading-snug text-gold/90">
            {project.kind}
          </p>
        ) : null}
        <p className="mt-2 font-sans text-sm leading-relaxed text-chrome">
          {project.summary}
        </p>
        {project.stack.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <li
                key={item}
                className="rounded-md border border-zinc-600/80 bg-zinc-900/80 px-2 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-200"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        {/* Links sit on the card's bottom edge so a row of cards lines up. */}
        <div className="mt-auto pt-3">
          {project.links ? (
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClassName}
                >
                  {link.label}
                  <ExternalLink className="h-3 w-3" aria-hidden />
                </a>
              ))}
            </p>
          ) : null}
          {project.href ? (
            <p className="inline-flex items-center gap-1 font-mono text-xs text-react">
              <span className="break-all">
                {project.href.replace(/^https:\/\/(www\.)?/, "").replace(/\/$/, "")}
              </span>
              <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
}

function ProjectEntry({ project }: { project: Project }) {
  if (project.href && !project.links) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${cardClassName} cursor-pointer`}
      >
        <ProjectBody project={project} />
      </a>
    );
  }

  return (
    <article className={cardClassName}>
      <ProjectBody project={project} />
    </article>
  );
}

export default function ProjectCard() {
  return (
    <section aria-labelledby="projects-heading" className="w-full min-w-0">
      <h2
        id="projects-heading"
        className="flex items-center gap-3 font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-chrome lg:text-xs"
      >
        <span>Projects</span>
        <span aria-hidden className="h-px flex-1 bg-[var(--surface-border)]" />
        <span aria-hidden className="font-mono tracking-normal text-chrome-dim">
          {String(PROJECTS.length).padStart(2, "0")}
        </span>
      </h2>
      {/* Wide screens: a grid across the page, first project spanning two columns. */}
      <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-5 lg:gap-4 xl:grid-cols-3">
        {PROJECTS.map((project, i) => (
          <li key={project.name} className={`min-w-0 ${i === 0 ? "sm:col-span-2" : ""}`}>
            <ProjectEntry project={project} />
          </li>
        ))}
      </ul>
    </section>
  );
}
