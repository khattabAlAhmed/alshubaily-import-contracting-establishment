import HeroSection from "@/components/sections/HeroSection";
import WhoWeAreSection from "@/components/sections/WhoWeAreSection";
import WhyUsSection from "@/components/sections/WhyUsSection";
import ProjectsShowcaseSection from "@/components/sections/ProjectsShowcaseSection";
import PartnersSection from "@/components/sections/PartnersSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <div>
      <main>
        <HeroSection />
        <WhoWeAreSection />
        <WhyUsSection />
        <PartnersSection />
        <ProjectsShowcaseSection />
        <ContactSection />
      </main>
    </div>
  );
}
