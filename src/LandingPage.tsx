import {
  Anchor,
  AppShell,
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
import { GamesBar } from "@/shared/ui/GamesBar";
import { Surface } from "./domains/player/components/Surface";
import { AppHeader } from "@/shared/ui/AppHeader";
import { cdnImage } from "@/entities/data/cdnImage";
import { useCommunityStats } from "@/hooks/useCommunityStats";

import "./LandingPage.css";
import WidgetBot from "@widgetbot/react-embed";

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

export default function LandingPage() {
  const communityStatsQuery = useCommunityStats();
  const communityStats = communityStatsQuery.data;
  const stats = [
    {
      value: communityStats ? communityStats.activeGames.toLocaleString() : "—",
      label: "Active Games",
    },
    {
      value: communityStats ? communityStats.players.toLocaleString() : "—",
      label: "Players",
    },
    {
      value: communityStats ? communityStats.gamesCompleted.toLocaleString() : "—",
      label: "Games Complete",
    },
  ];
  const sampledGames = communityStats?.gamesInProgress ?? [];
  const showGamesLoadError =
    communityStatsQuery.isError ||
    (!communityStatsQuery.isLoading && !communityStats);

  return (
    <AppShell header={{ height: 60 }}>
      <AppHeader className="appHeader">
        <GamesBar />
      </AppHeader>
      <AppShell.Main>
        <Stack gap={0} w="100%">
          {/* HERO */}
          <Box className="heroSection">
            <Box className="heroDockViewport">
              <Box className="heroDockLayout">
                <Box className="heroDockContent">
                  <Stack gap="md" className="fadeInUp">
                    <Title
                      order={1}
                      className="gradient-text space-title"
                      size={70}
                      visibleFrom="md"
                    >
                      Async Twilight Imperium
                    </Title>
                    <Title
                      order={1}
                      className="gradient-text space-title"
                      size={50}
                      hiddenFrom="md"
                    >
                      Async Twilight Imperium
                    </Title>
                    <Text
                      size={22}
                      lh={1.3}
                      fw={500}
                      c="gray.4"
                      className="enhancedText fadeInUp delay-1"
                    >
                      Play full games of Twilight Imperium asynchronously
                      through Discord. No marathon sessions required.
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
                  </Stack>
                </Box>

                <Box className="heroGameEmbedContainer fadeInUp delay-3">
                  <div className="heroGameEmbedFrameWrap">
                    <iframe
                      className="heroGameEmbedFrame"
                      src="/embed/pbd19460/map-only"
                      title="PBD19460 Map Only"
                      loading="lazy"
                    />
                  </div>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* FACTION ICON STRIP */}
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

          {/* STATS STRIP */}
          <Box className="statsStrip">
            <Container size={1400}>
              {communityStatsQuery.isError ? (
                <Text ta="center" c="gray.6" py={10} size="sm">
                  Could not load stats
                </Text>
              ) : (
                <div className="statsGrid">
                  {stats.map((stat) => (
                    <div key={stat.label} className="stat">
                      <span className="statValue">{stat.value}</span>
                      <span className="statLabel">{stat.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </Container>
          </Box>

          {/* HOW IT WORKS */}
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
            <Container size={1600} style={{ position: "relative", zIndex: 1 }}>
              <Title
                order={2}
                ta="center"
                mb={56}
                size={48}
                className="gradient-text space-title"
              >
                How it Works
              </Title>

              <Box id="how-it-works" className="howItWorksContentWrap">
                <Grid align="center">
                  <Grid.Col span={{ base: 12, lg: 6 }}>
                    <List spacing="xl" size="lg" center icon={<></>}>
                      <List.Item className="enhancedListItem">
                        <Text size="xl" fw={700} c="gray.2">
                          Play at your pace
                        </Text>
                        <Text
                          size="lg"
                          c="gray.4"
                          mt="xs"
                          className="enhancedText"
                        >
                          Take your turns whenever you've got a few minutes. No
                          coordinating schedules across time zones, no all-day
                          table sessions.
                        </Text>
                      </List.Item>

                      <List.Item className="enhancedListItem">
                        <Text size="xl" fw={700} c="gray.2">
                          Easy to use interface
                        </Text>
                        <Text
                          size="lg"
                          c="gray.4"
                          mt="xs"
                          className="enhancedText"
                        >
                          A Discord bot handles everything. Buttons and slash
                          commands let you move units, resolve combat, and
                          manage your faction right in the chat.
                        </Text>
                      </List.Item>

                      <List.Item className="enhancedListItem">
                        <Text size="xl" fw={700} c="gray.2">
                          Constantly updating map
                        </Text>
                        <Text
                          size="lg"
                          c="gray.4"
                          mt="xs"
                          className="enhancedText"
                        >
                          Every command updates the map automatically. Check it
                          on this site or in Discord — unit positions, system
                          control, and scoring all stay current.
                        </Text>
                      </List.Item>

                      <List.Item className="enhancedListItem">
                        <Text size="xl" fw={700} c="gray.2">
                          Fully reversible
                        </Text>
                        <Text
                          size="lg"
                          c="gray.4"
                          mt="xs"
                          className="enhancedText"
                        >
                          Made a mistake? Undo it. Game masters can tweak the
                          game state manually too, so house rules and weird edge
                          cases are never a problem.
                        </Text>
                      </List.Item>
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

          {/* GAMES IN PROGRESS */}
          <Box
            pt={100}
            pb={100}
            className="enhancedSection sectionVariant2"
          >
            <Container size={1400} style={{ position: "relative", zIndex: 1 }}>
              <Title
                order={2}
                ta="center"
                mb={16}
                size={48}
                className="gradient-text space-title"
              >
                Games in Progress
              </Title>
              <Text ta="center" c="gray.5" mb={48} maw={520} mx="auto">
                Dozens of games are running right now. Click into any one to
                see the map and scores.
              </Text>

              {showGamesLoadError ? (
                <Text ta="center" c="gray.6" mt={24} size="sm">
                  Could not load games in progress
                </Text>
              ) : (
                <div className="gameCardGrid">
                  {sampledGames.map((game) => (
                    <div key={game.id} className="gameCard">
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
                  ))}
                </div>
              )}
            </Container>
          </Box>

          {/* COMMUNITY */}
          <Box pt={100} pb={100} className="enhancedSection sectionVariant3">
            <Container size={1600} style={{ position: "relative", zIndex: 1 }}>
              <Title
                order={2}
                ta="center"
                mb={32}
                size={48}
                className="gradient-text-grey space-title"
              >
                Join our Community
              </Title>

              <Text
                size="lg"
                c="gray.4"
                ta="center"
                mb={32}
                className="enhancedText"
              >
                We run 32-player mega games, weird mods like 'Rotato Potato'
                (the map rings rotate each turn), and plenty of homebrew
                nonsense. Come hang out, talk strategy, or just watch the
                chaos.
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

          {/* BAN APPEALS */}
          <Box pt={80} pb={80} className="enhancedSection banAppealsSection">
            <Container size={800} style={{ position: "relative", zIndex: 1 }}>
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
                  Banned from the AsyncTI4 Discord and think it was a mistake?
                  Submit an appeal below. The mod team will review it and get
                  back to you.
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
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}
