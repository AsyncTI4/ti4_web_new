import { Stack } from "@mantine/core";
import { useCommunityStats } from "@/api/useCommunityStats";
import { PageShell } from "@/layout/PageShell";
import {
  BanAppealsSection,
  CommunitySection,
  FactionStrip,
  GamesInProgressSection,
  HeroSection,
  HowItWorksSection,
  StatsStrip,
} from "./LandingSections";

import "./LandingPage.css";

export default function LandingPage() {
  const communityStatsQuery = useCommunityStats();

  return (
    <PageShell footer>
      <Stack gap={0} w="100%">
        <HeroSection />
        <FactionStrip />
        <StatsStrip query={communityStatsQuery} />
        <HowItWorksSection />
        <GamesInProgressSection query={communityStatsQuery} />
        <CommunitySection />
        <BanAppealsSection />
      </Stack>
    </PageShell>
  );
}
