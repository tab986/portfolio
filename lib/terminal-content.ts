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
      { type: "text", text: "ROLE        : Back-End Web Developer" },
      { type: "text", text: "LOCATION    : Baghdad, Iraq" },
      {
        type: "text",
        text: "EDUCATION   : Computer Engineering Technology, Middle Technical University (2023 - 2027)",
      },
      {
        type: "text",
        text: "SUMMARY     : Back-End Web Developer with a background in Data Entry and database management.",
      },
      {
        type: "text",
        text: "              Adept at transforming raw data into structured, functional web applications.",
      },
      { type: "blank" },
    ],
  },
  {
    command: "cat skills",
    lines: [
      { type: "blank" },
      { type: "text", text: "[TECHNICAL STACK]" },
      { type: "text", text: "  * Core Backend : Node.js" },
      {
        type: "text",
        text: "  * Databases    : Database Management, Data Entry",
      },
      { type: "text", text: "  * Frontend     : HTML, CSS" },
      { type: "text", text: "  * Versioning   : Git & GitHub" },
      { type: "text", text: "  * Tools        : Microsoft Office" },
      { type: "blank" },
      { type: "text", text: "[SOFT SKILLS]" },
      { type: "text", text: "  * Collaboration" },
      { type: "text", text: "  * Problem-Solving & Research" },
      { type: "text", text: "  * Adaptability" },
      { type: "text", text: "  * Communication & Public Speaking" },
      { type: "text", text: "  * Attention to Detail" },
      { type: "text", text: "  * Ability to work under pressure" },
      { type: "blank" },
    ],
  },
  {
    command: "ls experience",
    lines: [
      { type: "blank" },
      { type: "text", text: "[DIR] /experience/" },
      { type: "text", text: "│" },
      { type: "text", text: "├── 01_backend_intern_gdg/" },
      { type: "text", text: "│   ├── Period      : 05/2025 - 08/2025" },
      { type: "text", text: "│   ├── Location    : Baghdad, Iraq" },
      { type: "text", text: "│   └── Highlights  :" },
      {
        type: "text",
        text: "│       - Collaborated with designers to refine layouts and interactions.",
      },
      {
        type: "text",
        text: "│       - Contributed to user profiles and reusable components.",
      },
      {
        type: "text",
        text: "│       - Utilized Git, debugging, and full-stack workflows.",
      },
      {
        type: "text",
        text: "│       - Analyzed problems and worked with teams to develop solutions.",
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
      { type: "text", text: "PROJECT NAME : gamewiseiq.com" },
      { type: "text", text: "ROLE         : Lead Backend Architect" },
      {
        type: "text",
        text: "DETAILS      : Architected and built the entire backend infrastructure.",
      },
      {
        type: "text",
        text: "              Ensured high availability, seamless data processing, and",
      },
      {
        type: "text",
        text: "              secure API integrations for thousands of active users.",
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
