import AuroraClient from "@/components/AuroraClient";
import ContactSection from "@/components/ContactSection";
import LanguageSync from "@/components/LanguageSync";
import PageTeleportScroll from "@/components/PageTeleportScroll";
import PortfolioTerminal from "@/components/PortfolioTerminal";
import ProjectCard from "@/components/ProjectCard";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import WelcomeIntro from "@/components/WelcomeIntro";

export default function Home() {
  return (
    <main className="relative w-full max-w-[100vw] overflow-x-hidden bg-obsidian">
      <LanguageSync />
      <AuroraClient />
      <PageTeleportScroll />
      <SiteNav />

      <WelcomeIntro />

      {/* Projects come straight after the intro: they are the strongest content. */}
      <section
        id="portfolio"
        aria-labelledby="projects-heading"
        className="relative z-10 mx-auto w-full max-w-[90rem] overflow-x-hidden px-4 pb-10 pt-20 sm:px-8 lg:min-h-svh lg:pb-14 lg:pt-24 xl:px-12"
      >
        <ProjectCard />
      </section>

      <PortfolioTerminal />

      <ContactSection />

      <SiteFooter />
    </main>
  );
}
