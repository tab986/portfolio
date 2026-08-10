import AuroraClient from "@/components/AuroraClient";
import HeroHeader from "@/components/HeroHeader";
import PageTeleportScroll from "@/components/PageTeleportScroll";
import ProjectCard from "@/components/ProjectCard";
import WelcomeIntro from "@/components/WelcomeIntro";
import LanyardCardClient from "@/components/band/LanyardCardClient";

export default function Home() {
  return (
    <main className="relative bg-obsidian">
      <AuroraClient />
      <PageTeleportScroll />

      <WelcomeIntro />

      <section
        id="portfolio"
        className="relative z-10 mx-auto flex min-h-svh w-full max-w-[90rem] flex-col px-5 py-8 sm:px-8 lg:px-8 lg:py-10 xl:px-12"
      >
        <div className="grid flex-1 grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8 lg:min-h-[calc(100svh-5rem)] xl:gap-10">
          <div className="flex flex-col justify-center gap-10 lg:col-span-5 lg:pr-4 xl:col-span-4">
            <HeroHeader />
            <div className="hidden max-w-md lg:block">
              <ProjectCard />
            </div>
          </div>

          <div className="flex w-full flex-col items-center justify-center lg:col-span-7 lg:items-end xl:col-span-8">
            <div className="w-full max-w-[760px] lg:-mr-2 xl:-mr-6">
              <LanyardCardClient />
            </div>
          </div>

          <div className="lg:hidden">
            <ProjectCard />
          </div>
        </div>

        <footer className="relative z-10 mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--surface-border)] pt-5 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-chrome-dim">
          <span>Abdalrhmn Anwar · Baghdad</span>
          <span className="text-chrome">React · Node.js · PostgreSQL</span>
        </footer>
      </section>
    </main>
  );
}
