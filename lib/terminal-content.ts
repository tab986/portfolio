export type TerminalLine =
  | { type: "text"; text: string }
  | { type: "blank" }
  | {
      type: "link";
      prefix: string;
      label: string;
      href: string;
    };

export type TerminalBlock = {
  command: string;
  lines: TerminalLine[];
};

export const PROMPT = "abdalrhmn@portfolio-cli:~$";

export const TERMINAL_SEQUENCE: TerminalBlock[] = [
  {
    command: "help",
    lines: [
      { type: "blank" },
      { type: "text", text: "Available Commands:" },
      {
        type: "text",
        text: "  - whoami        : Display bio and education background",
      },
      {
        type: "text",
        text: "  - cat skills    : List technical stack and soft skills",
      },
      {
        type: "text",
        text: "  - ls experience : Show work history and internships",
      },
      {
        type: "text",
        text: "  - run projects  : Display portfolio projects and architecture",
      },
      {
        type: "text",
        text: "  - contact       : Output contact details and social links",
      },
      { type: "text", text: "  - clear         : Clear the terminal screen" },
      { type: "blank" },
    ],
  },
  {
    command: "whoami",
    lines: [
      { type: "blank" },
      { type: "text", text: "[SYSTEM INFO]: Loading user profile..." },
      {
        type: "text",
        text: "--------------------------------------------------",
      },
      { type: "text", text: "NAME        : Abdalrhmn Anwar Hameed" },
      { type: "text", text: "ROLE        : Full-Stack Developer" },
      { type: "text", text: "LOCATION    : Baghdad, Iraq" },
      {
        type: "text",
        text: "EDUCATION   : Computer Engineering Technology, Middle Technical University (2023 – 2027)",
      },
      {
        type: "text",
        text: "SUMMARY     : Full-Stack Developer with hands-on experience building and shipping",
      },
      {
        type: "text",
        text: "              production web and mobile applications, from database design and",
      },
      {
        type: "text",
        text: "              backend APIs to responsive front-end interfaces. Experienced in owning",
      },
      {
        type: "text",
        text: "              complete systems end to end, deploying serverless apps on Cloudflare",
      },
      {
        type: "text",
        text: "              Workers, managing relational databases, and building secure licensing",
      },
      {
        type: "text",
        text: "              and payment flows.",
      },
      { type: "blank" },
    ],
  },
  {
    command: "cat skills",
    lines: [
      { type: "blank" },
      { type: "text", text: "[TECHNICAL STACK]" },
      {
        type: "text",
        text: "  * Backend        : Node.js, RESTful APIs, webhooks, authentication & secure API integrations",
      },
      {
        type: "text",
        text: "  * Frontend       : HTML, CSS, JavaScript, Next.js, responsive & RTL design",
      },
      {
        type: "text",
        text: "  * Mobile         : Flutter (Android & iOS), app store publishing",
      },
      {
        type: "text",
        text: "  * Databases      : PostgreSQL (Neon), SQL, schema design, data modeling, database management",
      },
      {
        type: "text",
        text: "  * Security       : Ed25519 digital signatures, license verification, webhook signature validation",
      },
      {
        type: "text",
        text: "  * Cloud & DevOps : Cloudflare Workers, serverless deployment, environment & secrets management, CI with GitHub",
      },
      {
        type: "text",
        text: "  * Tools          : Git & GitHub, Microsoft Office, Data Entry",
      },
      { type: "blank" },
      { type: "text", text: "[SOFT SKILLS]" },
      { type: "text", text: "  * Collaboration" },
      { type: "text", text: "  * Problem-Solving & Research" },
      { type: "text", text: "  * Adaptability" },
      { type: "text", text: "  * Communication & Public Speaking" },
      { type: "text", text: "  * Attention to Detail" },
      { type: "text", text: "  * Working Under Pressure" },
      { type: "blank" },
    ],
  },
  {
    command: "ls experience",
    lines: [
      { type: "blank" },
      { type: "text", text: "[DIR] /experience/" },
      { type: "text", text: "│" },
      { type: "text", text: "├── 01_fullstack_freelance/" },
      {
        type: "text",
        text: "│   ├── Role        : Full-Stack Developer (Freelance / Projects)",
      },
      { type: "text", text: "│   ├── Period      : 2025 – Present" },
      { type: "text", text: "│   ├── Location    : Baghdad, Iraq" },
      { type: "text", text: "│   └── Highlights  :" },
      {
        type: "text",
        text: "│       - Designed, built, and deployed full-stack web and mobile applications used by real customers in Iraq.",
      },
      {
        type: "text",
        text: "│       - Built RESTful APIs and backend services, and designed relational database schemas for scalability and data integrity.",
      },
      {
        type: "text",
        text: "│       - Delivered responsive front-end interfaces and published mobile apps on both Google Play and the Apple App Store.",
      },
      {
        type: "text",
        text: "│       - Deployed and maintained serverless applications on Cloudflare Workers, including environment and secrets management.",
      },
      { type: "text", text: "│" },
      { type: "text", text: "├── 02_backend_intern_gdg/" },
      { type: "text", text: "│   ├── Role        : Backend Intern, GDG" },
      { type: "text", text: "│   ├── Period      : 05/2025 – 08/2025" },
      { type: "text", text: "│   ├── Location    : Baghdad, Iraq" },
      { type: "text", text: "│   └── Highlights  :" },
      {
        type: "text",
        text: "│       - Collaborated with designers to refine layouts and interactions.",
      },
      {
        type: "text",
        text: "│       - Contributed to features like user profiles and ensured consistent styling with reusable components.",
      },
      {
        type: "text",
        text: "│       - Gained experience in debugging, Git, and structured full-stack workflows.",
      },
      {
        type: "text",
        text: "│       - Analyzed problems and worked with teams to develop solutions under strict deadlines.",
      },
      { type: "blank" },
    ],
  },
  {
    command: "run projects",
    lines: [
      { type: "blank" },
      { type: "text", text: "[EXECUTING]: Fetching deployed projects..." },
      {
        type: "text",
        text: "--------------------------------------------------",
      },
      { type: "text", text: "PROJECT NAME : TabibiQ" },
      { type: "text", text: "ROLE         : Full-Stack Developer" },
      {
        type: "text",
        text: "DETAILS      : Medical Appointment Booking Platform (Android & iOS).",
      },
      {
        type: "text",
        text: "              Patients search doctors and clinics by specialty and location,",
      },
      {
        type: "text",
        text: "              book appointments directly, and receive confirmations and reminders.",
      },
      {
        type: "text",
        text: "              Doctors and clinics manage daily appointments and track patient",
      },
      {
        type: "text",
        text: "              schedules to reduce waiting times.",
      },
      {
        type: "text",
        text: "              Published and maintained on both Google Play and the Apple App Store.",
      },
      {
        type: "link",
        prefix: "GOOGLE PLAY  : ",
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.tabibiq.app",
      },
      {
        type: "link",
        prefix: "APP STORE    : ",
        label: "App Store",
        href: "https://apps.apple.com/iq/app/tabibiq/id6807596163",
      },
      { type: "blank" },
      { type: "text", text: "PROJECT NAME : Teryaq" },
      { type: "text", text: "ROLE         : Full-Stack Developer" },
      {
        type: "text",
        text: "DETAILS      : Point of Sale (POS) System.",
      },
      {
        type: "text",
        text: "              Built a Flutter POS application with a complete software licensing system.",
      },
      {
        type: "text",
        text: "              Implemented cryptographic license verification (Ed25519 signatures)",
      },
      {
        type: "text",
        text: "              to prevent license forgery, with deep-link activation and an offline",
      },
      {
        type: "text",
        text: "              grace period.",
      },
      {
        type: "text",
        text: "              Integrated online payments through the Wayl payment gateway with signed",
      },
      {
        type: "text",
        text: "              webhook verification, connected to a Next.js billing website on",
      },
      {
        type: "text",
        text: "              Cloudflare Workers and a PostgreSQL (Neon) database.",
      },
      { type: "blank" },
      { type: "text", text: "PROJECT NAME : Hala Teacher" },
      { type: "text", text: "ROLE         : Front-End Developer" },
      { type: "text", text: "DETAILS      : Educational Website." },
      {
        type: "text",
        text: "              Built the complete front end for an English teacher's website",
      },
      {
        type: "text",
        text: "              (6th preparatory grade): course plans, downloadable study booklets,",
      },
      {
        type: "text",
        text: "              practice questions, and ministerial exam resources.",
      },
      {
        type: "text",
        text: "              Responsive Arabic (RTL) design, deployed on Cloudflare Workers.",
      },
      {
        type: "link",
        prefix: "LINK         : ",
        label: "halateacher.workers.dev",
        href: "https://www.halateacher.workers.dev/",
      },
      { type: "blank" },
      { type: "text", text: "PROJECT NAME : GameWiseIQ" },
      { type: "text", text: "ROLE         : Backend Developer" },
      {
        type: "text",
        text: "DETAILS      : Architected and built the entire backend infrastructure, ensuring",
      },
      {
        type: "text",
        text: "              high availability, seamless data processing, and secure API",
      },
      {
        type: "text",
        text: "              integrations to support thousands of active users.",
      },
      {
        type: "link",
        prefix: "LINK         : ",
        label: "gamewiseiq.com",
        href: "https://gamewiseiq.com",
      },
      { type: "blank" },
    ],
  },
  {
    command: "contact",
    lines: [
      { type: "blank" },
      { type: "text", text: "[CONTACT DETAILS]" },
      {
        type: "link",
        prefix: "  * Email    : ",
        label: "abood19982006abdalrhmn@gmail.com",
        href: "mailto:abood19982006abdalrhmn@gmail.com",
      },
      {
        type: "link",
        prefix: "  * Phone    : ",
        label: "+9647810952419",
        href: "tel:+9647810952419",
      },
      {
        type: "link",
        prefix: "  * LinkedIn : ",
        label: "linkedin.com/in/abdalrhmn-anwar-764679279",
        href: "https://linkedin.com/in/abdalrhmn-anwar-764679279",
      },
      { type: "blank" },
    ],
  },
];
