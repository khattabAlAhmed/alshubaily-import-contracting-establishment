import HeroSection from "@/components/sections/HeroSection";
import WhoWeAreSection from "@/components/sections/WhoWeAreSection";
import WhyUsSection from "@/components/sections/WhyUsSection";

export default function Home() {
  return (
    <div>
      <main>
        <HeroSection />
        <WhoWeAreSection />
        <WhyUsSection />
      </main>
    </div>
  );
}
