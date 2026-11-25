import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import { NowListening, ServiceLetters, Stats, Statement, Tiles, WhyWaste } from "@/components/V4Sections";
import Services from "@/components/Services";
import Marquee from "@/components/Marquee";
import Experience from "@/components/Experience";
import FeaturedProjects from "@/components/FeaturedProjects";
import Portfolio from "@/components/Portfolio";
import ProjectsList from "@/components/ProjectsList";
import TechStack from "@/components/TechStack";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import LetsTalk from "@/components/LetsTalk";
import Contact, { Footer } from "@/components/Contact";
import { testimonials } from "@/data/portfolio";

export default function Home() {
  return (
    <>
      <main>
        <Preloader />
        <Hero />
        <Stats />
        <Statement />
        <Tiles />
        <ServiceLetters />
        <Services />
        <Marquee />
        <Experience />
        <FeaturedProjects />
        <Portfolio />
        <ProjectsList />
        <TechStack />
        <About />
        <NowListening />
        {testimonials.length > 0 && <Testimonials />}
        <WhyWaste />
        <LetsTalk />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
