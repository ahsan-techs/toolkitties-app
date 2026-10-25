import Navbar from "@/components/Navbar";
import HeroSearch from "@/components/HeroSearch";
import FreeBanner from "@/components/FreeBanner";
import ToolMarquee from "@/components/ToolMarquee";
import ToolGroupSection from "@/components/ToolGroupSection";
import ScrollFeatureRows from "@/components/ScrollFeatureRows";
import ScaleTracker from "@/components/ScaleTracker";
import FeatureCards3D from "@/components/FeatureCards3D";
import FeedbackCta from "@/components/FeedbackCta";
import Footer from "@/components/Footer";
import HomeGeo, { HomeSchema } from "@/components/HomeGeo";
import WhyChoose from "@/components/WhyChoose";
import BackgroundShapes from "@/components/BackgroundShapes";
import Reveal from "@/components/motion/Reveal";
import ScrollProgress from "@/components/motion/ScrollProgress";
import { toolGroups } from "@/lib/tools-data";

export default function Home() {
  return (
    <>
      <HomeSchema />
      <ScrollProgress />
      <Navbar />
      {/* isolate + overflow-x-clip keep the soft background shapes behind the content and inside the page width */}
      <div className="relative isolate overflow-x-clip">
        <BackgroundShapes />
        <main>
          <HeroSearch />
          <FreeBanner />
          <ToolMarquee />

          <section id="tools" className="container-content divide-y divide-ink/10 py-6">
            {toolGroups.map((group) => (
              <ToolGroupSection key={group.id} group={group} />
            ))}
          </section>

          <ScrollFeatureRows />
          <Reveal>
            <ScaleTracker />
          </Reveal>
          <FeatureCards3D />
          <FeedbackCta />
          <HomeGeo />
          <WhyChoose />
        </main>
      </div>
      <Footer />
    </>
  );
}
