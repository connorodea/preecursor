import Hero from "@/components/sections/Hero";
import ImpactBand from "@/components/sections/ImpactBand";
import Capabilities from "@/components/sections/Capabilities";
import AnswerFeature from "@/components/sections/AnswerFeature";
import SelectedWork from "@/components/sections/SelectedWork";
import Spotlight from "@/components/sections/Spotlight";
import Approach from "@/components/sections/Approach";
import Locations from "@/components/sections/Locations";
import People from "@/components/sections/People";
import Careers from "@/components/sections/Careers";
import FeaturedInsights from "@/components/sections/FeaturedInsights";
import ContactCTA from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <ImpactBand />
      <Capabilities />
      <AnswerFeature />
      <SelectedWork />
      <Spotlight />
      <Approach />
      <Locations />
      <People />
      <Careers />
      <FeaturedInsights />
      <ContactCTA />
    </>
  );
}
