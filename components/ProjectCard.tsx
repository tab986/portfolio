type ProjectLink = {
  label: string;
  href: string;
};

type Project = {
  name: string;
  role: string;
  detail: string;
  href?: string;
  domain?: string;
  links?: ProjectLink[];
};

const PROJECTS: Project[] = [
  {
    name: "TabibiQ",
    role: "Full-Stack Developer",
    detail: "Medical Appointment Booking · Android & iOS",
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
    detail: "Flutter POS · Ed25519 licensing · Wayl",
  },
  {
    name: "Hala Teacher",
    role: "Front-End Developer",
    detail: "Educational Website · Arabic (RTL)",
    href: "https://www.halateacher.workers.dev/",
    domain: "halateacher.workers.dev",
  },
  {
    name: "GameWiseIQ",
    role: "Backend Developer",
    detail: "High availability & secure API integrations",
    href: "https://gamewiseiq.com",
    domain: "gamewiseiq.com",
  },
];

const cardClassName =
  "glass-panel group tap-target block w-full max-w-full rounded-lg p-4 transition-all duration-300 hover:border-gold/40 hover:shadow-[0_0_32px_rgba(212,175,55,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold sm:p-5";

function ProjectBody({ project }: { project: Project }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-chrome-dim">
            {project.role}
          </p>
          <h2 className="mt-2 break-words font-sans text-xl font-semibold tracking-tight text-warm-white transition-colors group-hover:text-gold sm:text-2xl">
            {project.name}
          </h2>
          {project.domain ? (
            <p className="mt-1 break-all font-mono text-xs text-react">
              {project.domain}
            </p>
          ) : null}
          {project.links ? (
            <p className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all font-mono text-xs text-react underline-offset-2 hover:text-gold hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </p>
          ) : null}
        </div>
        {project.href ? (
          <span
            aria-hidden
            className="mt-1 shrink-0 text-chrome-dim transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
          >
            ↗
          </span>
        ) : null}
      </div>

      <span className="mt-4 inline-block max-w-full rounded-md border border-zinc-700/50 bg-zinc-900/80 px-2.5 py-1.5 font-sans text-[10px] font-medium uppercase leading-snug tracking-[0.12em] text-zinc-300">
        {project.detail}
      </span>
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
      {PROJECTS.map((project) => (
        <ProjectEntry key={project.name} project={project} />
      ))}
    </div>
  );
}
