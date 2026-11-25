import Preloader from "@/components/Preloader";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Marquee from "@/components/Marquee";
import Experience from "@/components/Experience";
import TechStack from "@/components/TechStack";
import FeaturedProjects from "@/components/FeaturedProjects";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import LetsTalk from "@/components/LetsTalk";
import Testimonials from "@/components/Testimonials";
import Contact, { Footer } from "@/components/Contact";
import { testimonials } from "@/data/portfolio";

export default function Home() {
  return (
    <>
      <main>
        <Preloader />
        <Hero />
        <Services />
        <Marquee />
        <Experience />
        <TechStack />
        <FeaturedProjects />
        <About />
        <Portfolio />
        {testimonials.length > 0 && <Testimonials />}
        <LetsTalk />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
