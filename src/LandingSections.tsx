import type { ReactNode } from "react";
import {
  Anchor,
  Box,
  Button,
  Container,
  Grid,
  Image,
  List,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconBrandDiscord } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import WidgetBot from "@widgetbot/react-embed";
import { Surface } from "@/shared/ui/Surface";
import { cdnImage } from "@/entities/data/cdnImage";
import type { useCommunityStats } from "@/hooks/useCommunityStats";

type CommunityStatsQuery = ReturnType<typeof useCommunityStats>;

const HERO_TITLE_SIZES = [
  { size: 70, visibleFrom: "md" },
  { size: 50, hiddenFrom: "md" },
] as const;

const HERO_TICKS = ["Free to play", "Bot-managed rules", "Live web maps"];

const SHOWCASE_FACTIONS = [
  "hacan",
  "sol",
  "letnev",
  "jolnar",
  "xxcha",
  "sardakk",
  "arborec",
  "mentak",
  "naalu",
  "nekro",
  "muaat",
  "yin",
  "ghost",
  "l1z1x",
  "saar",
  "winnu",
  "yssaril",
  "argent",
  "mahact",
  "nomad",
  "bentor",
  "celdauri",
  "cheiran",
  "edyn",
  "ghemina",
  "gledge",
  "kolume",
  "kyro",
  "nokar",
  "tnelis",
  "vaden",
  "zelian",
];

const HOW_IT_WORKS = [
  {
    title: "Play at your pace",
    body: "Take your turns whenever you've got a few minutes. No coordinating schedules across time zones, no all-day table sessions.",
  },
  {
    title: "Easy to use interface",
    body: "A Discord bot handles everything. Buttons and slash commands let you move units, resolve combat, and manage your faction right in the chat.",
  },
  {
    title: "Constantly updating map",
    body: "Every command updates the map automatically. Check it on this site or in Discord — unit positions, system control, and scoring all stay current.",
  },
  {
    title: "Fully reversible",
    body: "Made a mistake? Undo it. Game masters can tweak the game state manually too, so house rules and weird edge cases are never a problem.",
  },
];

const STAT_FIELDS = [
  { key: "activeGames", label: "Active Games" },
  { key: "players", label: "Players" },
  { key: "gamesCompleted", label: "Games Complete" },
] as const;

function SectionHeading({
  number,
  kicker,
  mb,
  className = "gradient-text space-title",
  children,
}: {
  number: string;
  kicker: string;
  mb: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="sectionKicker">
        <span className="sectionKickerNum">{number}</span>
        {kicker}
      </div>
      <Title order={2} ta="center" mb={mb} size={48} className={className}>
        {children}
      </Title>
    </>
  );
}

export function HeroSection() {
  return (
    <Box className="heroSection">
      <Box className="heroDockViewport">
        <Box className="heroDockLayout">
          <Box className="heroDockContent">
            <Stack gap="md" className="fadeInUp">
              <Box>
                <span className="heroTag">
                  Play-by-Discord · Twilight Imperium 4E
                </span>
                <div className="heroDivider" />
              </Box>
              {HERO_TITLE_SIZES.map(({ size, ...visibility }) => (
                <Title
                  key={size}
                  order={1}
                  className="gradient-text space-title"
                  size={size}
                  {...visibility}
                >
                  Async Twilight Imperium
                </Title>
              ))}
              <Text size="sm" c="gray.6">
                A fan project for Twilight Imperium™
              </Text>
              <Text
                fz={22}
                lh={1.3}
                fw={500}
                c="gray.4"
                className="enhancedText fadeInUp delay-1"
              >
                Play full games of Twilight Imperium asynchronously through
                Discord. No marathon sessions required.
              </Text>
              <Button
                component="a"
                href="https://discord.gg/asyncti4"
                target="_blank"
                rel="noopener noreferrer"
                size="xl"
                variant="filled"
                className="enhancedButton fadeInUp delay-2"
                mt="md"
                leftSection={<IconBrandDiscord size={28} />}
              >
                Join our Discord
              </Button>
              <div className="heroTicks fadeInUp delay-3">
                {HERO_TICKS.map((tick) => (
                  <span key={tick} className="heroTick">
                    {tick}
                  </span>
                ))}
              </div>
            </Stack>
          </Box>

          <Box className="heroGameEmbedContainer fadeInUp delay-3">
            <div className="heroGameEmbedFrameWrap">
              <iframe
                className="heroGameEmbedFrame"
                src="/embed/pbd19460/map-only?sidebar=none"
                title="PBD19460 Map Only"
                loading="lazy"
              />
            </div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export function FactionStrip() {
  return (
    <Box className="factionStrip">
      <div className="factionStripInner">
        {SHOWCASE_FACTIONS.map((faction) => (
          <Image
            key={faction}
            src={cdnImage(`/factions/${faction}.png`)}
            alt={faction}
            w={44}
            h={44}
            className="factionStripIcon"
          />
        ))}
      </div>
    </Box>
  );
}

export function StatsStrip({ query }: { query: CommunityStatsQuery }) {
  return (
    <Box className="statsStrip">
      <Container size={1400}>
        {query.isError ? (
          <Text ta="center" c="gray.6" py={10} size="sm">
            Could not load stats
          </Text>
        ) : (
          <div className="statsGrid">
            {STAT_FIELDS.map(({ key, label }) => (
              <div key={label} className="stat">
                <span className="statValue">
                  {query.data?.[key].toLocaleString() ?? "—"}
                </span>
                <span className="statLabel">{label}</span>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Box>
  );
}

export function HowItWorksSection() {
  return (
    <Box
      pt={100}
      pb={100}
      className="enhancedSection sectionVariant1 howItWorksSection"
    >
      <img
        src="/chillhacan.webp"
        alt=""
        aria-hidden="true"
        className="howItWorksCornerArt"
      />
      <img
        src="/mentakcurls.webp"
        alt=""
        aria-hidden="true"
        className="howItWorksCornerArtRight"
      />
      <Container size={1600} className="sectionContainer">
        <SectionHeading number="01" kicker="Gameplay" mb={56}>
          How it Works
        </SectionHeading>

        <Box id="how-it-works" className="howItWorksContentWrap">
          <Grid align="center">
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <List spacing="xl" size="lg" center icon={<></>}>
                {HOW_IT_WORKS.map((item) => (
                  <List.Item key={item.title} className="enhancedListItem">
                    <Text size="xl" fw={700} c="gray.2">
                      {item.title}
                    </Text>
                    <Text size="lg" c="gray.4" mt="xs" className="enhancedText">
                      {item.body}
                    </Text>
                  </List.Item>
                ))}
              </List>
            </Grid.Col>
            <Grid.Col span={{ base: 12, lg: 6 }}>
              <Surface pattern="circle" cornerAccents>
                <Image
                  src="/discord.png"
                  alt="Discord interface"
                  radius="xl"
                  height={500}
                />
              </Surface>
            </Grid.Col>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

function GameCard({
  game,
}: {
  game: NonNullable<CommunityStatsQuery["data"]>["gamesInProgress"][number];
}) {
  return (
    <div className="gameCard">
      <Text className="gameCardTitle" c="gray.2">
        {game.name}
      </Text>
      <Text className="gameCardMeta" c="gray.5">
        Round {game.round} · {game.vpTarget} VP
      </Text>
      <div className="gameCardFactions">
        {game.factions.map((faction) => (
          <Image
            key={faction}
            src={cdnImage(`/factions/${faction}.png`)}
            alt={faction}
            w={28}
            h={28}
            className="gameCardFactionIcon"
          />
        ))}
      </div>
      <Button
        component={Link}
        to={`/game/${game.id}`}
        variant="default"
        size="sm"
        className="gameCardButton"
      >
        Watch Game
      </Button>
    </div>
  );
}

export function GamesInProgressSection({
  query,
}: {
  query: CommunityStatsQuery;
}) {
  const showLoadError = query.isError || (!query.isLoading && !query.data);

  return (
    <Box pt={100} pb={100} className="enhancedSection sectionVariant2">
      <Container size={1400} className="sectionContainer">
        <SectionHeading number="02" kicker="Live Operations" mb={16}>
          Games in Progress
        </SectionHeading>
        <Text ta="center" c="gray.5" mb={48} maw={520} mx="auto">
          Dozens of games are running right now. Click into any one to see the
          map and scores.
        </Text>

        {showLoadError ? (
          <Text ta="center" c="gray.6" mt={24} size="sm">
            Could not load games in progress
          </Text>
        ) : (
          <div className="gameCardGrid">
            {(query.data?.gamesInProgress ?? []).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </Container>
    </Box>
  );
}

export function CommunitySection() {
  return (
    <Box pt={100} pb={100} className="enhancedSection sectionVariant3">
      <Container size={1600} className="sectionContainer">
        <SectionHeading
          number="03"
          kicker="Community"
          mb={32}
          className="gradient-text-grey space-title"
        >
          Join our Community
        </SectionHeading>

        <Text size="lg" c="gray.4" ta="center" mb={32} className="enhancedText">
          We run 32-player mega games, weird mods like 'Rotato Potato' (the map
          rings rotate each turn), and plenty of homebrew nonsense. Come hang
          out, talk strategy, or just watch the chaos.
        </Text>

        <Surface pattern="grid" cornerAccents>
          <WidgetBot
            server="943410040369479690"
            channel="1025083568839471165"
            width="100%"
            height="600px"
          />
        </Surface>
      </Container>
    </Box>
  );
}

export function BanAppealsSection() {
  return (
    <Box pt={80} pb={80} className="enhancedSection banAppealsSection">
      <Container size={800} className="sectionContainer">
        <Stack align="center" gap="md">
          <Title
            order={2}
            ta="center"
            size={36}
            c="gray.4"
            className="space-title"
          >
            Server Ban Appeals
          </Title>
          <Text size="md" c="gray.5" ta="center" maw={620}>
            Banned from the AsyncTI4 Discord and think it was a mistake? Submit
            an appeal below. The mod team will review it and get back to you.
          </Text>
          <Button
            component="a"
            href="https://forms.gle/o5D9JoXTbxpXEQfT9"
            target="_blank"
            rel="noopener noreferrer"
            size="md"
            variant="outline"
            color="gray"
            mt="sm"
          >
            Submit a Ban Appeal
          </Button>
          <Text size="xs" c="gray.6" ta="center">
            Appeals are only for bans from the{" "}
            <Anchor
              href="https://discord.gg/asyncti4"
              target="_blank"
              rel="noopener noreferrer"
              c="gray.5"
              size="xs"
            >
              AsyncTI4 Discord server
            </Anchor>
            . Do not use this form to report bugs or request game support.
          </Text>
        </Stack>
      </Container>
    </Box>
  );
}
