import {
  AppShell,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Image,
  List,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconBrandDiscord } from "@tabler/icons-react";
import Logo from "./components/Logo";
import { DiscordLogin } from "./components/DiscordLogin";

import "./LandingPage.css";
import WidgetBot from "@widgetbot/react-embed";
import { useMaps } from "./hooks/useMaps";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useMemo } from "react";

function useMapDetails(mapIds) {
  const baseApiUrl =
    "https://bbg9uiqewd.execute-api.us-east-1.amazonaws.com/Prod/map/";

  return useQuery({
    queryKey: ["mapDetails", mapIds],
    queryFn: () =>
      Promise.all(
        mapIds.map((id) =>
          fetch(`${baseApiUrl}${id}`).then((res) => res.json())
        )
      ).then((results) => results.flat()),
    enabled: !!mapIds && mapIds.length > 0,
  });
}

export default function LandingPage() {
  const theme = useMantineTheme();
  const mapsQuery = useMaps();
  const maps = mapsQuery.data ?? [];

  const mapsToHighlight = useMemo(() => {
    return maps.length > 6
      ? maps
          .map((m) => m.MapName)
          .sort(() => 0.5 - Math.random())
          .slice(0, 6)
      : maps.map((m) => m.MapName);
  }, [maps]);

  const mapDetailsQuery = useMapDetails(mapsToHighlight);
  const mapDetails = mapDetailsQuery.data ?? [];

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group align="center" h="100%" px="sm" gap="sm">
          <Logo />
          <div className="logo-divider" />
          <div style={{ flexGrow: 1 }} />
          <Box visibleFrom="sm">
            <DiscordLogin />
          </Box>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Stack gap={0} w="100%">
          <Box
            pt={60}
            pb={120}
            style={{
              backgroundImage: 'url("/tilebg.jpg")',
              backgroundRepeat: "repeat",
              backgroundSize: "auto",
            }}
          >
            <Container size={1400}>
              <Grid align="center" mt="xl">
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <Stack spacing="xl">
                    <Title
                      order={1}
                      className="gradient-text space-title"
                      size={80}
                      visibleFrom="md"
                    >
                      Async Twilight Imperium
                    </Title>
                    <Title
                      order={1}
                      className="gradient-text space-title"
                      size={60}
                      hiddenFrom="md"
                    >
                      Async Twilight Imperium
                    </Title>
                    <Text size={28} lh={1.2} fw={500} c="orange.1">
                      Conquer the galaxy at your own pace. Experience the epic
                      space opera of Twilight Imperium, played entirely through
                      Discord.
                    </Text>
                    <Button
                      size="xl"
                      variant="filled"
                      color="orange.6"
                      mt="xl"
                      style={{
                        borderRadius: "var(--mantine-radius-lg)",
                      }}
                      leftSection={<IconBrandDiscord size={36} />}
                    >
                      Join our Discord
                    </Button>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 6 }}>
                  <Box align="center">
                    <Image
                      src="/mapimage.webp"
                      alt="Twilight Imperium Game"
                      radius="md"
                      fit="contain"
                      style={{
                        maxWidth: "600px",
                        width: "100%",
                        height: "auto",
                      }}
                    />
                  </Box>
                </Grid.Col>
              </Grid>
            </Container>
          </Box>
          <Box
            pt={120}
            pb={120}
            style={{
              background: `linear-gradient(to bottom,
                          black 0.25%,
                          ${theme.colors.dark[9]} 5%)`,
            }}
          >
            <Container size={1600}>
              <Title
                order={2}
                align="center"
                mb={64}
                size={52}
                c="orange.4"
                className="gradient-text space-title"
              >
                How it Works
              </Title>

              <Box id="how-it-works" className="section">
                <Grid align="center">
                  <Grid.Col span={{ base: 12, lg: 6 }}>
                    <List spacing="xl" size="lg" center icon={<></>}>
                      <List.Item>
                        <Text size="xl" fw={700} c="orange.4">
                          Play at your pace
                        </Text>
                        <Text size="lg" c="orange.2" mt="xs">
                          Take your turns when it's convenient for you, no
                          real-time commitment needed. Our asynchronous play
                          system allows you to enjoy the epic scale of Twilight
                          Imperium without the need for marathon gaming
                          sessions.
                        </Text>
                      </List.Item>

                      <List.Item>
                        <Text size="xl" fw={700} c="orange.4">
                          Easy to use interface
                        </Text>
                        <Text size="lg" c="orange.2" mt="xs">
                          The Discord bot provides buttons and commands for all
                          game actions. Players use these to move units, make
                          decisions, and interact with game systems directly in
                          the Discord chat.
                        </Text>
                      </List.Item>

                      <List.Item>
                        <Text size="xl" fw={700} c="orange.4">
                          Constantly updating map
                        </Text>
                        <Text size="lg" c="orange.2" mt="xs">
                          As players input commands, our system automatically
                          updates a visual map of the game state. This map is
                          accessible through the Async TI website or directly
                          within Discord. You'll always have a clear, up-to-date
                          view of the galaxy, including unit positions,
                          controlled systems, and other crucial information.
                        </Text>
                      </List.Item>

                      <List.Item>
                        <Text size="xl" fw={700} c="orange.4">
                          Fully reversible
                        </Text>
                        <Text size="lg" c="orange.2" mt="xs">
                          Easily undo actions and correct mistakes. Game masters
                          can manually adjust the game state, allowing for house
                          rules and creative solutions. Our flexible system
                          enhances gameplay without limiting your options.
                        </Text>
                      </List.Item>
                    </List>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Image
                      src="/discord.png"
                      alt="Join Discord"
                      radius="xl"
                      height={500}
                    />
                  </Grid.Col>
                </Grid>
              </Box>
            </Container>
          </Box>

          <Box pt={60} pb={120} bg="dark.9">
            <Container size={1600}>
              <Title
                order={2}
                align="center"
                mb={32}
                size={52}
                c="orange.4"
                className="gradient-text space-title"
              >
                Active Games
              </Title>

              <Text size="lg" c="orange.2" mt="xs" align="center" mb={32}>
                Peek into the current state of active games to see what it looks
                like!
              </Text>

              <Grid>
                {mapDetails.map((mapDetail, index) => (
                  <Grid.Col
                    key={index}
                    span={{
                      base: 12,
                      sm: 6,
                      md: 4,
                      lg: 3,
                    }}
                  >
                    <Card
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      style={{
                        backgroundColor: "rgba(31, 41, 55, 0.8)",
                        borderColor: "rgba(255, 128, 0, 0.5)",
                      }}
                    >
                      <Card.Section withBorder>
                        <Text
                          size="xl"
                          fw={700}
                          c="orange.4"
                          p="md"
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {mapDetail.customName}
                        </Text>
                      </Card.Section>

                      <Stack spacing={2} mt="md">
                        {mapDetail.mapTemplateID != "null" ? (
                          <Text c="orange.2">
                            Type: {mapDetail.mapTemplateID}
                          </Text>
                        ) : (
                          <Text c="orange.2">Type: Other</Text>
                        )}
                        <Text c="orange.2">
                          Current Round: {mapDetail.round}
                        </Text>
                        <Text c="orange.2">VPs: {mapDetail.vp}</Text>
                      </Stack>

                      <Button
                        fullWidth
                        mt="lg"
                        size="md"
                        variant="gradient"
                        gradient={{ from: "orange", to: "red" }}
                        component={Link}
                        to={`/game/${mapDetail.name}`}
                      >
                        Observe Game
                      </Button>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            </Container>
          </Box>
          <Box pt={120} pb={120} bg="dark.9">
            <Container size={1600}>
              <Title
                order={2}
                align="center"
                mb={32}
                size={52}
                c="orange.4"
                className="gradient-text space-title"
              >
                Join our community
              </Title>

              <Text size="lg" c="orange.2" mt="xs" align="center" mb={32}>
                We're a vibrant community that loves to push the boundaries of
                Twilight Imperium! From hosting epic 32-player games to creating
                wild mods like 'Rotato Potato' (where map rings rotate each
                turn), we're all about fun and creative gameplay. Join us for
                all kinds of homebrew nonsense, strategic discussions, and a
                galaxy of possibilities!
              </Text>

              <WidgetBot
                server="943410040369479690"
                channel="1025083568839471165"
                width="100%"
                height="600px"
              />
            </Container>
          </Box>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}
