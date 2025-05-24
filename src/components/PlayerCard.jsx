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
    { name: "Anti-Mass Deflectors", color: "blue", isUnitUpgrade: false },
    { name: "Gravity Drive", color: "blue", isUnitUpgrade: false },
    { name: "Fleet Logistics", color: "blue", isUnitUpgrade: false },
    { name: "Light-Wave Deflector", color: "blue", isUnitUpgrade: false },

    { name: "Sarween Tools", color: "yellow", isUnitUpgrade: false },
    { name: "Plasma Scoring", color: "red", isUnitUpgrade: false },
    { name: "Daxcive Animators", color: "green", isUnitUpgrade: false },
    { name: "Hyper Metabolism", color: "green", isUnitUpgrade: false },
    { name: "Integrated Economy", color: "yellow", isUnitUpgrade: false },

    // { name: "Carrier II", color: "blue", isUnitUpgrade: true },
    // { name: "Dreadnought II", color: "yellow", isUnitUpgrade: true },
    // { name: "Fighter II", color: "green", isUnitUpgrade: true },
  ],
  relics = [
    "Shard of the Throne",
    "Crown of Emphidia",
    // "Obsidian",
    // "Stellar Converter",
  ],
  promissoryNotes = ["Support for the Throne", "Trade Agreement"],
  planets = [
    { name: "Mecatol Rex", resources: 1, influence: 6 },
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
  scoredSecrets = [
    "(685) Gather a Mighty Fleet",
    "(583) Monopolize Production",
    "(189) Unveil Flagship",
  ],
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

  const planetTraitIcons = {
    cultural: (
      <Image
        src={`/planet_attributes/pc_attribute_cultural.png`}
        alt="cultural"
        style={{ width: "16px", height: "16px" }}
      />
    ),
    hazardous: (
      <Image
        src={`/planet_attributes/pc_attribute_hazardous.png`}
        alt="hazardous"
        style={{ width: "16px", height: "16px" }}
      />
    ),
    industrial: (
      <Image
        src={`/planet_attributes/pc_attribute_industrial.png`}
        alt="industrial"
        style={{ width: "16px", height: "16px" }}
      />
    ),
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

  const theme = useMantineTheme();

  return (
    <Paper
      p="sm"
      bg="blueGray.9"
      style={{ maxWidth: "100%", border: "2px solid #ffc0cb7d", margin: "5px" }}
      radius="md"
      shadow="lg"
      pos="relative"
    >
      <Group justify="space-between" mb="lg">
        <Group gap={30}>
          <Group gap={4} py={2}>
            <Text span c="white" size="lg" ff="heading">
              {playerName}
            </Text>
            <Text size="md" span ml={4} opacity={0.9} c="white" ff="heading">
              [{faction}]
            </Text>
            <Text size="sm" span ml={4} ff="heading" c="pink">
              (pink)
            </Text>
          </Group>
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

      <Grid gutter={0} columns={12}>
        <Grid.Col span={2}>
          <Stack>
            <Group gap={4}>
              <Box pos="relative">
                <Box
                  style={{
                    width: "45px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Image src="/cardback/cardback_so.png" alt="action cards" />
                </Box>
                <Text
                  size="lg"
                  fw={700}
                  c="white"
                  pos="absolute"
                  left={12}
                  bottom={2}
                  px={5}
                >
                  0
                </Text>
              </Box>

              <Box pos="relative">
                <Box
                  style={{
                    width: "45px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Image
                    src="/cardback/cardback_action.png"
                    alt="action cards"
                  />
                </Box>
                <Text
                  size="lg"
                  fw={700}
                  c="white"
                  pos="absolute"
                  left={12}
                  bottom={2}
                  px={5}
                >
                  4
                </Text>
              </Box>
              <Box pos="relative">
                <Box
                  style={{
                    width: "45px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Image src="/cardback/cardback_pn.png" alt="action cards" />
                </Box>
                <Text
                  size="lg"
                  fw={700}
                  c="white"
                  pos="absolute"
                  left={12}
                  bottom={2}
                  px={5}
                >
                  7
                </Text>
              </Box>
              <Box pos="relative">
                <Box
                  style={{
                    width: "45px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Image src="/cardback/cardback_tg.png" alt="action cards" />
                </Box>
                <Text
                  size="lg"
                  fw={700}
                  c="white"
                  pos="absolute"
                  left={8}
                  bottom={2}
                  px={5}
                >
                  17
                </Text>
              </Box>
              <Box pos="relative">
                <Box
                  style={{
                    width: "45px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <Image
                    src="/cardback/cardback_comms.png"
                    alt="action cards"
                  />
                </Box>
                <Text
                  size="lg"
                  fw={700}
                  c="white"
                  pos="absolute"
                  left={4}
                  bottom={2}
                  px={5}
                >
                  0/6
                </Text>
              </Box>
            </Group>
            <Stack gap={2}>
              {scoredSecrets.map((secret, index) => (
                <Badge
                  radius="sm"
                  variant="light"
                  color="red"
                  fw={700}
                  leftSection={
                    <Image
                      src="/so_icon.png"
                      style={{ width: "12px", height: "12px" }}
                    />
                  }
                >
                  {secret}
                </Badge>
              ))}
            </Stack>
          </Stack>
        </Grid.Col>
        <Grid.Col span={10} style={{ display: "flex", alignItems: "center" }}>
          <Stack gap="xs">
            <Group
              bg="rgba(0, 0, 0, 0.5)"
              w="fit-content"
              p="xs"
              style={{
                borderRadius: "10px",
              }}
            >
              <Group gap="xs" align="top">
                <Stack gap="xs">
                  {techs
                    .filter((v) => v.color === "blue")
                    .map((tech, index) => (
                      <Badge
                        w="100%"
                        color={`${tech.color}.2`}
                        leftSection={
                          <Image
                            src={`/${tech.color}.png`}
                            alt={tech.name}
                            style={{ width: "16px", height: "16px" }}
                          />
                        }
                        c="blue.9"
                      >
                        {tech.name}
                      </Badge>
                    ))}
                </Stack>

                <Stack gap="xs">
                  {techs
                    .filter((v) => v.color === "yellow")
                    .map((tech, index) => (
                      <Tooltip key={index} label={tech.name}>
                        <Badge
                          w="100%"
                          color={`${tech.color}.2`}
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
                </Stack>

                <Stack gap="xs">
                  {techs
                    .filter((v) => v.color === "green")
                    .map((tech, index) => (
                      <Tooltip key={index} label={tech.name}>
                        <Badge
                          w="100%"
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
                </Stack>

                <Stack gap="xs">
                  {techs
                    .filter((v) => v.color === "red")
                    .map((tech, index) => (
                      <Tooltip key={index} label={tech.name}>
                        <Badge
                          w="100%"
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
                </Stack>
              </Group>
              <Box>
                <Image
                  src="/mockunitupgrades.png"
                  alt="unit upgrades"
                  style={{
                    width: "auto",
                    height: "110px",
                  }}
                />
              </Box>
            </Group>
            <Box>
              <Group gap="xs">
                {planets.map((planet, index) => (
                  <Stack
                    key={index}
                    bg={
                      planet.trait === "cultural"
                        ? "rgba(0, 100, 255, 0.1)"
                        : planet.trait === "hazardous"
                          ? "rgba(255, 50, 50, 0.1)"
                          : "rgba(50, 200, 50, 0.1)"
                    }
                    py={4}
                    px="xs"
                    justify="space-between"
                    h={140}
                    style={{
                      borderRadius: "12px",
                      border: "1px solid",
                      borderColor:
                        planet.trait === "cultural"
                          ? "rgba(0, 100, 255, 0.3)"
                          : planet.trait === "hazardous"
                            ? "rgba(255, 50, 50, 0.3)"
                            : "rgba(50, 200, 50, 0.3)",
                    }}
                  >
                    <Stack gap={6}>
                      {planetTraitIcons[planet.trait]}
                      <Text
                        size="xs"
                        c="white"
                        fw={700}
                        style={{
                          writingMode: "vertical-rl",
                          textOrientation: "sideways",
                          whiteSpace: "nowrap",
                          transform: "rotate(180deg)",
                        }}
                      >
                        {planet.name}
                      </Text>
                    </Stack>
                    <Stack gap={4}>
                      {planet.techSkip && techSkipIcons[planet.techSkip]}
                      <Stack gap={2}>
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
                      </Stack>
                    </Stack>
                  </Stack>
                ))}
              </Group>
            </Box>
          </Stack>
        </Grid.Col>
      </Grid>

      <Group gap={2} mb="xs" mt="lg">
        {leaders.map((leader, index) => (
          <Box
            p={2}
            px="sm"
            style={{ borderRadius: "4px", border: "2px solid white" }}
          >
            <Text size="sm" fw={700} c="white">
              {leader}
            </Text>
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
            <Group gap="xs"></Group>
          </Box>
        </Grid.Col>
      </Grid>
      {/*
      <Grid gutter={2} mt="xl" w="70%">
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
                    <Text c="white" fw={700} size="sm">
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
                  <Text c="dimmed" size="sm">
                    {tech}
                  </Text>
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
              "X-89 Bacterial Weapon",
            ].map((tech, index) => {
              if (index === 9) {
                return (
                  <Group gap="xs" bg="green.9" px="xs">
                    <Image
                      src={`/green.png`}
                      alt={tech}
                      style={{ width: "16px", height: "16px" }}
                    />
                    <Text c="white" fw={700} size="sm">
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
                  <Text c="dimmed" size="sm">
                    {tech}
                  </Text>
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
                    <Text c="white" fw={700} size="sm">
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
                  <Text c="dimmed" size="sm">
                    {tech}
                  </Text>
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
                    <Text c="white" fw={700} size="sm">
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
                  <Text c="dimmed" size="sm">
                    {tech}
                  </Text>
                </Group>
              );
            })}
          </Stack>
        </Grid.Col>
      </Grid> */}

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

      <Box
        style={{
          position: "absolute",
          bottom: -20,
          right: -10,
          opacity: 0,
          zIndex: 0,
          pointerEvents: "none",
          height: "50%",
          overflow: "hidden",
        }}
        px={4}
        py={2}
      >
        <Image
          src="/sol.png"
          alt="faction"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </Box>
    </Paper>
  );
}
