import AuroraClient from "@/components/AuroraClient";
import HeroHeader from "@/components/HeroHeader";
import PageTeleportScroll from "@/components/PageTeleportScroll";
import PortfolioTerminal from "@/components/PortfolioTerminal";
import ProjectCard from "@/components/ProjectCard";
import WelcomeIntro from "@/components/WelcomeIntro";
import LanyardCardClient from "@/components/band/LanyardCardClient";

export default function Home() {
  return (
    <main className="relative w-full max-w-[100vw] overflow-x-hidden bg-obsidian">
      <AuroraClient />
      <PageTeleportScroll />

      <WelcomeIntro />

      <PortfolioTerminal />

      <section
        id="portfolio"
        className="relative z-10 mx-auto flex min-h-svh w-full max-w-[90rem] flex-col overflow-x-hidden px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6 sm:px-8 sm:py-8 lg:px-8 lg:py-10 xl:px-12"
      >
        <div className="grid flex-1 grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-12 lg:items-center lg:gap-8 lg:min-h-[calc(100svh-5rem)] xl:gap-10">
          <div className="order-1 flex min-w-0 flex-col justify-center gap-6 lg:order-none lg:col-span-5 lg:gap-10 lg:pr-4 xl:col-span-4">
            <HeroHeader />
            <div className="hidden max-w-md lg:block">
              <ProjectCard />
            </div>
          </div>

          <div className="order-2 flex w-full min-w-0 flex-col items-center justify-center lg:order-none lg:col-span-7 lg:items-end xl:col-span-8">
            {/* Desktop offsets unchanged; mobile centers and contains the stage */}
            <div className="mx-auto w-full max-w-[100vw] overflow-hidden lg:mx-0 lg:max-w-[760px] lg:-mr-2 lg:overflow-visible xl:-mr-6">
              <LanyardCardClient />
            </div>
          </div>

          <div className="order-3 min-w-0 lg:hidden">
            <ProjectCard />
          </div>
        </div>

        <footer className="relative z-10 order-4 mt-8 flex flex-col gap-4 border-t border-[var(--surface-border)] pt-5 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-chrome-dim sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-3 sm:tracking-[0.16em]">
          <span>Abdalrhmn Anwar · Baghdad</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href="/cv/abdalrhmn-anwar-cv.pdf"
              download="Abdalrhmn-Anwar-CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="tap-target inline-flex min-h-11 cursor-pointer items-center text-chrome transition-colors duration-300 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              CV / Resume
            </a>
            <span className="text-chrome">React · Node.js · PostgreSQL</span>
          </div>
        </footer>
      </section>
    </main>
  );
}
