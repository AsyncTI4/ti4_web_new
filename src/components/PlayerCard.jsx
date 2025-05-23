import { useState } from "react";
import {
  Paper,
  Group,
  Badge,
  Tooltip,
  Text,
  Grid,
  Stack,
  ActionIcon,
  Box,
  useMantineTheme,
  Image,
  Chip,
  Divider,
} from "@mantine/core";
import {
  IconCircle,
  IconCrown,
  IconAnchor,
  IconBuilding,
  IconUsers,
  IconLeaf,
  IconMountain,
  IconFlag,
} from "@tabler/icons-react";

export default function PlayerCard({
  playerName = "Alice",
  faction = "Federation of Sol",
  color = "blue",
  strategyCard = 4,
  actionCards = 7,
  secretObjectives = 2,
  publicObjectives = 1,
  tradeGoods = 3,
  commodities = 4,
  tactics = 1,
  fleet = 4,
  strategy = 2,
  leaders = [
    "1. Evelyn Delouis",
    "2. Claire Gibson",
    "3. Jace X. 4th Air Legion",
  ],
  techs = [
    { name: "Neural Motivator", color: "blue", isUnitUpgrade: false },
    { name: "Sarween Tools", color: "yellow", isUnitUpgrade: false },
    { name: "Plasma Scoring", color: "red", isUnitUpgrade: false },
    { name: "Gravity Drive", color: "blue", isUnitUpgrade: false },
    { name: "Daxcive Animators", color: "green", isUnitUpgrade: false },
    { name: "Hyper Metabolism", color: "green", isUnitUpgrade: false },
    { name: "Integrated Economy", color: "yellow", isUnitUpgrade: false },
    { name: "Light-Wave Deflector", color: "blue", isUnitUpgrade: false },
    { name: "Carrier II", color: "blue", isUnitUpgrade: true },
    { name: "Dreadnought II", color: "yellow", isUnitUpgrade: true },
    { name: "Fighter II", color: "green", isUnitUpgrade: true },
  ],
  relics = [
    "Shard of the Throne",
    "Crown of Emphidia",
    // "Obsidian",
    // "Stellar Converter",
  ],
  promissoryNotes = ["Support for the Throne", "Trade Agreement"],
  planets = [
    { name: "Mecatol Rex", resources: 1, influence: 6, trait: "cultural" },
    {
      name: "Abyz",
      resources: 3,
      influence: 0,
      trait: "hazardous",
      techSkip: "warfare",
    },
    { name: "Fria", resources: 2, influence: 0, trait: "hazardous" },
    { name: "Bereg", resources: 3, influence: 1, trait: "hazardous" },
    { name: "Lirta IV", resources: 2, influence: 3, trait: "industrial" },
    {
      name: "Meer",
      resources: 0,
      influence: 4,
      trait: "cultural",
      techSkip: "biotic",
    },
    { name: "Arinam", resources: 1, influence: 2, trait: "industrial" },
    { name: "Arnor", resources: 2, influence: 1, trait: "industrial" },
    { name: "Lor", resources: 1, influence: 2, trait: "industrial" },
    { name: "Winnu", resources: 3, influence: 1, trait: "cultural" },
  ],
  neighbors = ["Player 2", "Player 3"],
  scoredSecrets = ["Cut Supply Lines", "Destroy Their Greatest Ship"],
}) {
  const totalResources = planets.reduce(
    (sum, planet) => sum + planet.resources,
    0
  );
  const totalInfluence = planets.reduce(
    (sum, planet) => sum + planet.influence,
    0
  );

  const traitIcons = {
    cultural: <IconLeaf size={12} color="green" />,
    hazardous: <IconMountain size={12} color="red" />,
    industrial: <IconBuilding size={12} color="yellow" />,
  };

  const techSkipIcons = {
    biotic: (
      <Image
        src={`/green.png`}
        alt="biotic"
        style={{ width: "16px", height: "16px" }}
      />
    ),
    propulsion: (
      <Image
        src={`/blue.png`}
        alt="propulsion"
        style={{ width: "16px", height: "16px" }}
      />
    ),
    cybernetic: (
      <Image
        src={`/yellow.png`}
        alt="cybernetic"
        style={{ width: "16px", height: "16px" }}
      />
    ),
    warfare: (
      <Image
        src={`/red.png`}
        alt="warfare"
        style={{ width: "16px", height: "16px" }}
      />
    ),
  };

  const sortedTechs = techs.sort((a, b) => {
    if (a.color !== b.color) return a.color.localeCompare(b.color);
    if (a.isUnitUpgrade !== b.isUnitUpgrade) return a.isUnitUpgrade ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

  const theme = useMantineTheme();

  return (
    <Paper
      p="sm"
      bg="blueGray.9"
      style={{ maxWidth: "100%" }}
      radius="md"
      shadow="lg"
    >
      <Group justify="space-between" mb="xs">
        <Group>
          <Group gap="xs" p="xs">
            <Box bg="white" style={{ borderRadius: "20px" }} px={4} py={2}>
              <Image src="/sol.png" alt="faction" style={{ width: "20px" }} />
            </Box>
            <Box>
              <Text fw={700} span c="white">
                {playerName}
              </Text>
              <Text size="sm" span ml={4} opacity={0.9} c="white">
                [{faction}]
              </Text>
            </Box>
          </Group>

          <Badge variant="outline" color="green" size="lg">
            {strategyCard}: CONSTRUCTION
          </Badge>
        </Group>

        <Group gap="xs">
          {/* <Group gap={4}>
            <IconCircle size={16} color="yellow" />
            {actionCards}
          </Group> */}
          {/* <Group gap={4}>
            <IconShield size={16} color="blue" />
            {secretObjectives}
          </Group>
          <Group gap={4}>
            <IconSword size={16} color="red" />
            {publicObjectives}
          </Group> */}
          <Group gap={4}>
            <Image
              src={`/tg.png`}
              alt="trade goods"
              style={{ width: "16px", height: "16px" }}
            />
            {tradeGoods}
          </Group>
          <Group gap={4}>
            <Image
              src={`/comms.png`}
              alt="trade goods"
              style={{ width: "16px", height: "16px" }}
            />
            {commodities}
          </Group>
          {/* <Group gap={4} bg="dark.7" px="xs" style={{ borderRadius: "4px" }}>
            <Tooltip label="Tactics">
              <Text>T</Text>
            </Tooltip>
            <Text>{tactics}</Text>
            <Text>/</Text>
            <Tooltip label="Fleet">
              <Text>F</Text>
            </Tooltip>
            <Text>{fleet}</Text>
            <Text>/</Text>
            <Tooltip label="Strategy">
              <Text>S</Text>
            </Tooltip>
            <Text>{strategy}</Text>
          </Group> */}
        </Group>
      </Group>

      <Group gap="xs" mb="xs">
        {leaders.map((leader, index) => (
          <Box bg="gray.9" p="xs" style={{ borderRadius: "4px" }}>
            <Text>{leader}</Text>
          </Box>
        ))}
      </Group>

      <Grid gutter="xs" mt="xl">
        <Grid.Col span={6}>
          <Box>
            <Group gap="xs">
              {relics.map((relic, index) => (
                <Tooltip key={index} label={relic}>
                  <Badge
                    color="yellow.3"
                    c="black"
                    leftSection={<IconAnchor size={12} />}
                  >
                    {relic}
                  </Badge>
                </Tooltip>
              ))}
            </Group>
          </Box>
        </Grid.Col>

        <Grid.Col span={6}>
          <Box>
            <Group gap="xs">
              {scoredSecrets.map((secret, index) => (
                <Tooltip key={index} label={secret}>
                  <Chip
                    size="xs"
                    radius="sm"
                    variant="light"
                    color="red"
                    fw={700}
                    checked={true}
                    leftSection={<IconFlag size={12} />}
                  >
                    {secret}
                  </Chip>
                </Tooltip>
              ))}
            </Group>
          </Box>
        </Grid.Col>
      </Grid>

      <Grid gutter={2} mt="xl">
        <Grid.Col span={3}>
          <Stack gap={0}>
            {[
              "Anti-Mass Deflectors",
              "Gravity Drive",
              "Fleet Logistics",
              "Lightwave Deflectors",
            ].map((tech, index) => {
              if (index === 2 || index === 1) {
                return (
                  <Group gap="xs" bg="blue.9" px="xs">
                    <Image
                      src={`/blue.png`}
                      alt={tech}
                      style={{ width: "16px", height: "16px" }}
                    />
                    <Text c="white" fw={700}>
                      {tech}
                    </Text>
                  </Group>
                );
              }

              return (
                <Group gap="xs" bg="transparent" px="xs">
                  <Image
                    src={`/blue.png`}
                    alt={tech}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <Text c="dimmed">{tech}</Text>
                </Group>
              );
            })}
          </Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack gap={0}>
            {[
              "Neural Motivator",
              "Daxcive Animators",
              "Hyper Metabolism",
              "X-89 whatever its called",
            ].map((tech, index) => {
              if (index === 9) {
                return (
                  <Group gap="xs" bg="green.9" px="xs">
                    <Image
                      src={`/green.png`}
                      alt={tech}
                      style={{ width: "16px", height: "16px" }}
                    />
                    <Text c="white" fw={700}>
                      {tech}
                    </Text>
                  </Group>
                );
              }

              return (
                <Group gap="xs" bg="transparent" px="xs">
                  <Image
                    src={`/green.png`}
                    alt={tech}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <Text c="dimmed">{tech}</Text>
                </Group>
              );
            })}
          </Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack gap={0}>
            {[
              "Sarween Tools",
              "Graviton Laser System",
              "Transit Diodes",
              "Integrated Economy",
            ].map((tech, index) => {
              if (index === 0) {
                return (
                  <Group gap="xs" bg="yellow.9" px="xs">
                    <Image
                      src={`/yellow.png`}
                      alt={tech}
                      style={{ width: "16px", height: "16px" }}
                    />
                    <Text c="white" fw={700}>
                      {tech}
                    </Text>
                  </Group>
                );
              }

              return (
                <Group gap="xs" bg="transparent" px="xs">
                  <Image
                    src={`/yellow.png`}
                    alt={tech}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <Text c="dimmed">{tech}</Text>
                </Group>
              );
            })}
          </Stack>
        </Grid.Col>
        <Grid.Col span={3}>
          <Stack gap={0}>
            {[
              "Plasma Scoring",
              "Mageon Defense Grid",
              "Duranium Armopr",
              "Assault Cannon",
            ].map((tech, index) => {
              if (index === 0 || index === 3) {
                return (
                  <Group gap="xs" bg="red.9" px="xs">
                    <Image
                      src={`/red.png`}
                      alt={tech}
                      style={{ width: "16px", height: "16px" }}
                    />
                    <Text c="white" fw={700}>
                      {tech}
                    </Text>
                  </Group>
                );
              }

              return (
                <Group gap="xs" bg="transparent" px="xs">
                  <Image
                    src={`/red.png`}
                    alt={tech}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <Text c="dimmed">{tech}</Text>
                </Group>
              );
            })}
          </Stack>
        </Grid.Col>
      </Grid>

      <Box mt="xl">
        <Stack gap="xs" mb="xs">
          <Box>
            <Group gap="xs">
              {sortedTechs
                .filter((v) => v.color === "blue")
                .map((tech, index) => (
                  <Tooltip key={index} label={tech.name}>
                    <Badge
                      color={tech.color}
                      leftSection={
                        <Image
                          src={`/${tech.color}.png`}
                          alt={tech.name}
                          style={{ width: "16px", height: "16px" }}
                        />
                      }
                    >
                      {tech.name}
                    </Badge>
                  </Tooltip>
                ))}
            </Group>
          </Box>
          <Box>
            <Group gap="xs">
              {sortedTechs
                .filter((v) => v.color === "yellow")
                .map((tech, index) => (
                  <Tooltip key={index} label={tech.name}>
                    <Badge
                      color={tech.color}
                      leftSection={
                        <Image
                          src={`/${tech.color}.png`}
                          alt={tech.name}
                          style={{ width: "16px", height: "16px" }}
                        />
                      }
                    >
                      {tech.name}
                    </Badge>
                  </Tooltip>
                ))}
            </Group>
          </Box>

          <Box>
            <Group gap="xs">
              {sortedTechs
                .filter((v) => v.color === "green")
                .map((tech, index) => (
                  <Tooltip key={index} label={tech.name}>
                    <Badge
                      color={tech.color}
                      leftSection={
                        <Image
                          src={`/${tech.color}.png`}
                          alt={tech.name}
                          style={{ width: "16px", height: "16px" }}
                        />
                      }
                    >
                      {tech.name}
                    </Badge>
                  </Tooltip>
                ))}
            </Group>
          </Box>
          <Box>
            <Group gap="xs">
              {sortedTechs
                .filter((v) => v.color === "red")
                .map((tech, index) => (
                  <Tooltip key={index} label={tech.name}>
                    <Badge
                      color={tech.color}
                      leftSection={
                        <Image
                          src={`/${tech.color}.png`}
                          alt={tech.name}
                          style={{ width: "16px", height: "16px" }}
                        />
                      }
                    >
                      {tech.name}
                    </Badge>
                  </Tooltip>
                ))}
            </Group>
          </Box>

          {/* {sortedTechs.map((tech, index) => (
            <Tooltip key={index} label={tech.name}>
              <Badge
                color={tech.color}
                leftSection={
                  <Image
                    src={`/${tech.color}.png`}
                    alt={tech.name}
                    style={{ width: "16px", height: "16px" }}
                  />
                }
              >
                {tech.name}
              </Badge>
            </Tooltip>
          ))} */}
        </Stack>
      </Box>

      <Box mt="xl">
        <Grid gutter="xs" mb="xs">
          {planets.map((planet, index) => (
            <Grid.Col key={index} span={{ base: 4, sm: 4, md: 4, lg: 2 }}>
              <Tooltip
                label={`${planet.name}: ${planet.resources} resources, ${planet.influence} influence, ${planet.trait} planet${planet.techSkip ? `, ${planet.techSkip} tech skip` : ""}`}
              >
                <Group
                  flex={1}
                  justify="space-between"
                  bg="blueGray.5"
                  py={4}
                  px="xs"
                  style={{
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: theme.colors.blueGray[2],
                  }}
                >
                  <Text size="xs" c="white" fw={700}>
                    {planet.name}
                  </Text>
                  <Group gap={4}>
                    {planet.techSkip && techSkipIcons[planet.techSkip]}
                    <Text
                      size="xs"
                      bg="blue"
                      px={4}
                      c="white"
                      fw={700}
                      style={{ borderRadius: "4px" }}
                    >
                      {planet.resources}
                    </Text>

                    <Text
                      size="xs"
                      bg="yellow"
                      px={4}
                      c="white"
                      fw={700}
                      style={{ borderRadius: "4px" }}
                    >
                      {planet.influence}
                    </Text>
                  </Group>
                </Group>
              </Tooltip>
            </Grid.Col>
          ))}
        </Grid>
      </Box>

      <Group justify="space-between" align="center" mt="lg">
        <Group gap="xs">
          <Badge color="yellow" size="lg">
            Total Resources: {totalResources}
          </Badge>
          <Badge color="blue" size="lg">
            Total Influence: {totalInfluence}
          </Badge>
        </Group>
        <Group align="center">
          <Text size="xs">Neighbors:</Text>
          {neighbors.map((neighbor, index) => (
            <Tooltip key={index} label={neighbor}>
              <ActionIcon variant="outline" color="gray" size="sm">
                <IconUsers size={16} />
              </ActionIcon>
            </Tooltip>
          ))}
        </Group>
      </Group>
    </Paper>
  );
}
