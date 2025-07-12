import {
  Anchor,
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
import { Surface } from "./components/PlayerArea/Surface";

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
      <AppShell.Header className="appHeader">
        <Group align="center" h="100%" px="sm" gap="sm">
          <Logo />
          <div className="logo-divider" />
          <Anchor
            to="/games"
            size="sm"
            fw={600}
            underline="hover"
            c="gray.4"
            ml="sm"
            mr="sm"
            component={Link}
          >
            All Games
          </Anchor>
          <div style={{ flexGrow: 1 }} />
          <Box visibleFrom="sm">
            <DiscordLogin />
          </Box>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Stack gap={0} w="100%">
          <Box
            className="heroSection"
            style={{
              backgroundImage: 'url("/tilebg.jpg")',
              backgroundRepeat: "repeat",
              backgroundSize: "auto",
            }}
          >
            <Container size={1400} style={{ position: "relative", zIndex: 3 }}>
              <Grid align="center" mt={0}>
                <Grid.Col span={{ base: 12, lg: 4 }}>
                  <Stack spacing="xl" className="fadeInUp">
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
                      size={60}
                      hiddenFrom="md"
                    >
                      Async Twilight Imperium
                    </Title>
                    <Text
                      size={28}
                      lh={1.2}
                      fw={500}
                      c="gray.2"
                      className="enhancedText fadeInUp delay-1"
                    >
                      Conquer the galaxy at your own pace. Experience the epic
                      space opera of Twilight Imperium, played entirely through
                      Discord.
                    </Text>
                    <Button
                      component="a"
                      href="https://discord.asyncti4.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      size="xl"
                      variant="filled"
                      className="enhancedButton fadeInUp delay-2"
                      mt="xl"
                      leftSection={<IconBrandDiscord size={36} />}
                    >
                      Join our Discord
                    </Button>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 8 }}>
                  <Box className="mapImageContainer fadeInUp delay-3">
                    <div className="mapImageWrapper">
                      <Image
                        src="/mapimage.webp"
                        alt="Twilight Imperium Game"
                        radius="lg"
                        fit="contain"
                        style={{
                          width: "100%",
                          height: "auto",
                          position: "relative",
                          zIndex: 2,
                        }}
                      />
                    </div>
                  </Box>
                </Grid.Col>
              </Grid>
            </Container>
          </Box>
          <Box pt={120} pb={120} className="enhancedSection sectionVariant1">
            <Container size={1600} style={{ position: "relative", zIndex: 1 }}>
              <Title
                order={2}
                align="center"
                mb={64}
                size={52}
                c="blue.4"
                className="gradient-text space-title"
              >
                How it Works
              </Title>

              <Box id="how-it-works" className="section">
                <Grid align="center">
                  <Grid.Col span={{ base: 12, lg: 6 }}>
                    <List spacing="xl" size="lg" center icon={<></>}>
                      <List.Item className="enhancedListItem">
                        <Text size="xl" fw={700} c="blue.4">
                          Play at your pace
                        </Text>
                        <Text
                          size="lg"
                          c="gray.3"
                          mt="xs"
                          className="enhancedText"
                        >
                          Take your turns when it's convenient for you, no
                          real-time commitment needed. Our asynchronous play
                          system allows you to enjoy the epic scale of Twilight
                          Imperium without the need for marathon gaming
                          sessions.
                        </Text>
                      </List.Item>

                      <List.Item className="enhancedListItem">
                        <Text size="xl" fw={700} c="blue.4">
                          Easy to use interface
                        </Text>
                        <Text
                          size="lg"
                          c="gray.3"
                          mt="xs"
                          className="enhancedText"
                        >
                          The Discord bot provides buttons and commands for all
                          game actions. Players use these to move units, make
                          decisions, and interact with game systems directly in
                          the Discord chat.
                        </Text>
                      </List.Item>

                      <List.Item className="enhancedListItem">
                        <Text size="xl" fw={700} c="blue.4">
                          Constantly updating map
                        </Text>
                        <Text
                          size="lg"
                          c="gray.3"
                          mt="xs"
                          className="enhancedText"
                        >
                          As players input commands, our system automatically
                          updates a visual map of the game state. This map is
                          accessible through the AsyncTI4 website or directly
                          within Discord. You'll always have a clear, up-to-date
                          view of the galaxy, including unit positions,
                          controlled systems, and other crucial information.
                        </Text>
                      </List.Item>

                      <List.Item className="enhancedListItem">
                        <Text size="xl" fw={700} c="blue.4">
                          Fully reversible
                        </Text>
                        <Text
                          size="lg"
                          c="gray.3"
                          mt="xs"
                          className="enhancedText"
                        >
                          Easily undo actions and correct mistakes. Game masters
                          can manually adjust the game state, allowing for house
                          rules and creative solutions. Our flexible system
                          enhances gameplay without limiting your options.
                        </Text>
                      </List.Item>
                    </List>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, lg: 6 }}>
                    <Surface pattern="circle" cornerAccents>
                      <Image
                        src="/discord.png"
                        alt="Join Discord"
                        radius="xl"
                        height={500}
                      />
                    </Surface>
                  </Grid.Col>
                </Grid>
              </Box>
            </Container>
          </Box>

          <Box pt={60} pb={120} className="enhancedSection sectionVariant2">
            <Container size={1600} style={{ position: "relative", zIndex: 1 }}>
              <Title
                order={2}
                align="center"
                mb={32}
                size={52}
                c="violet.4"
                className="gradient-text-purple space-title"
              >
                Active Games
              </Title>

              <Text
                size="lg"
                c="violet.2"
                mt="xs"
                align="center"
                mb={32}
                className="enhancedText"
              >
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
                      className="cleanCard"
                    >
                      <Card.Section>
                        <Text
                          size="xl"
                          fw={700}
                          c="violet.4"
                          p="md"
                          className="enhancedText"
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
                          <Text c="violet.2" className="enhancedText">
                            Type: {mapDetail.mapTemplateID}
                          </Text>
                        ) : (
                          <Text c="violet.2" className="enhancedText">
                            Type: Other
                          </Text>
                        )}
                        <Text c="violet.2" className="enhancedText">
                          Current Round: {mapDetail.round}
                        </Text>
                        <Text c="violet.2" className="enhancedText">
                          VPs: {mapDetail.vp}
                        </Text>
                      </Stack>

                      <Button
                        fullWidth
                        mt="lg"
                        size="md"
                        variant="gradient"
                        gradient={{ from: "violet", to: "purple" }}
                        component={Link}
                        to={`/game/${mapDetail.name}`}
                        className="purpleButton"
                      >
                        Observe Game
                      </Button>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            </Container>
          </Box>
          <Box pt={120} pb={120} className="enhancedSection sectionVariant3">
            <Container size={1600} style={{ position: "relative", zIndex: 1 }}>
              <Title
                order={2}
                align="center"
                mb={32}
                size={52}
                c="gray.4"
                className="gradient-text-grey space-title"
              >
                Join our community
              </Title>

              <Text
                size="lg"
                c="gray.3"
                mt="xs"
                align="center"
                mb={32}
                className="enhancedText"
              >
                We're a vibrant community that loves to push the boundaries of
                Twilight Imperium! From hosting epic 32-player games to creating
                wild mods like 'Rotato Potato' (where map rings rotate each
                turn), we're all about fun and creative gameplay. Join us for
                all kinds of homebrew nonsense, strategic discussions, and a
                galaxy of possibilities!
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
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}
