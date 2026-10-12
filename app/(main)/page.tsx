import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import ToolGroupSection from "@/components/ToolGroupSection";
import ScrollFeatureRows from "@/components/ScrollFeatureRows";
import ScaleTracker from "@/components/ScaleTracker";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import HomeGeo, { HomeSchema } from "@/components/HomeGeo";
import { toolGroups } from "@/lib/tools-data";

export default function Home() {
  return (
    <>
      <HomeSchema />
      <Navbar />
      <main>
        <HeroSearch />

        <section id="tools" className="container-content divide-y divide-ink/10 py-6">
          {toolGroups.map((group) => (
            <ToolGroupSection key={group.id} group={group} />
          ))}
        </section>

        <ScrollFeatureRows />
        <ScaleTracker />
        <PricingSection />
        <HomeGeo />
      </main>
      <Footer />
    </>
  );
}
