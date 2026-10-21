import {
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
  role: string;
  summary: string;
  stack: string[];
  icon: LucideIcon;
  tone: string;
  href?: string;
  links?: ProjectLink[];
};

const PROJECTS: Project[] = [
  {
    name: "TabibiQ",
    role: "Full-Stack Developer",
    summary:
      "Patients search doctors by specialty and location, book visits, and get reminders that reduce waiting.",
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
    role: "Full-Stack Developer",
    summary:
      "Flutter point-of-sale app with Ed25519 licensing and Wayl payments on a Next.js billing site.",
    stack: ["Flutter", "Ed25519", "Wayl", "Next.js", "PostgreSQL", "Cloudflare Workers"],
    icon: Store,
    tone: "from-[#3a3424] to-[#1a1a1a]",
  },
  {
    name: "Hala Teacher",
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
      "Backend built for high availability, data processing, and secure API integrations.",
    stack: [],
    icon: Server,
    tone: "from-[#2c2838] to-[#1a1a1a]",
    href: "https://gamewiseiq.com",
  },
];

const cardClassName =
  "glass-panel group tap-target block w-full max-w-full overflow-hidden rounded-lg transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_32px_rgba(212,175,55,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

const linkClassName =
  "tap-target inline-flex min-h-11 items-center gap-1 rounded-sm font-mono text-xs text-react underline-offset-2 hover:text-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold";

function ProjectVisual({ project }: { project: Project }) {
  const Icon = project.icon;
  return (
    <div
      aria-hidden
      className={`relative flex h-24 items-center justify-center bg-gradient-to-br ${project.tone}`}
    >
      <span className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-black/25 text-gold">
        <Icon className="h-6 w-6" />
      </span>
    </div>
  );
}

function ProjectBody({ project }: { project: Project }) {
  return (
    <>
      <ProjectVisual project={project} />
      <div className="p-4 sm:p-5">
        <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-chrome">
          {project.role}
        </p>
        <h3 className="mt-2 break-words font-sans text-xl font-semibold tracking-tight text-warm-white transition-colors group-hover:text-gold sm:text-2xl">
          {project.name}
        </h3>
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
        {project.links ? (
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
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
          <p className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-react">
            <span className="break-all">{project.href.replace(/^https:\/\//, "")}</span>
            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
          </p>
        ) : null}
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
    <div className="flex w-full flex-col gap-3">
      <h2 className="font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-chrome">
        Projects
      </h2>
      {PROJECTS.map((project) => (
        <ProjectEntry key={project.name} project={project} />
      ))}
    </div>
  );
}
