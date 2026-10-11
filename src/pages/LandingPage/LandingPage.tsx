import { useCommunityStats } from "@/api/useCommunityStats";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { PageShell } from "@/layout/PageShell";
import {
  BanAppealsSection,
  CommunitySection,
  FactionStrip,
  FeaturesSection,
  GamesInProgressSection,
  HeroSection,
  HowItWorksSection,
} from "./LandingSections";
import classes from "./LandingPage.module.css";

export default function LandingPage() {
  useDocumentTitle("AsyncTI4 · Twilight Imperium over Discord");
  const communityStatsQuery = useCommunityStats();

  return (
    <PageShell footer mainClassName={classes.page}>
      <HeroSection query={communityStatsQuery} />
      <FactionStrip />
      <HowItWorksSection />
      <FeaturesSection />
      <GamesInProgressSection query={communityStatsQuery} />
      <CommunitySection />
      <BanAppealsSection />
    </PageShell>
  );
}
