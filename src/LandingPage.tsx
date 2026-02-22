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
import { GamesBar } from "@/shared/ui/GamesBar";
import { Surface } from "./domains/player/components/Surface";
import { AppHeader } from "@/shared/ui/AppHeader";

import "./LandingPage.css";
import WidgetBot from "@widgetbot/react-embed";

export default function LandingPage() {
  return (
    <AppShell header={{ height: 60 }}>
      <AppHeader className="appHeader">
        <GamesBar />
      </AppHeader>
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
                      c="gray.3"
                      className="enhancedText fadeInUp delay-1"
                    >
                      Conquer the galaxy at your own pace. Experience the epic
                      space opera of Twilight Imperium, played entirely through
                      Discord.
                    </Text>
                    <Button
                      component="a"
                      href="https://discord.gg/asyncti4"
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
                c="gray.3"
                className="gradient-text space-title"
              >
                How it Works
              </Title>

              <Box id="how-it-works" className="section">
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
                          Take your turns when it's convenient for you, no
                          real-time commitment needed. Our asynchronous play
                          system allows you to enjoy the epic scale of Twilight
                          Imperium without the need for marathon gaming
                          sessions.
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
                          The Discord bot provides buttons and commands for all
                          game actions. Players use these to move units, make
                          decisions, and interact with game systems directly in
                          the Discord chat.
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
                          As players input commands, our system automatically
                          updates a visual map of the game state. This map is
                          accessible through the AsyncTI4 website or directly
                          within Discord. You'll always have a clear, up-to-date
                          view of the galaxy, including unit positions,
                          controlled systems, and other crucial information.
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
                c="gray.4"
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
                  If you have been banned from the AsyncTI4 Discord server and
                  believe the ban was issued in error, or you would like to
                  request reconsideration, you may submit an appeal using the
                  form below. Our moderation team reviews all submissions and
                  will follow up with you directly.
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
                  . Do not use this form to report bugs or request game
                  support.
                </Text>
              </Stack>
            </Container>
          </Box>
        </Stack>
      </AppShell.Main>
    </AppShell>
  );
}
