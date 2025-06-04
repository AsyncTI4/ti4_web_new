import { useQuery } from "@tanstack/react-query";

export function useOverlayData(gameId) {
  const apiUrl = import.meta.env.DEV
    ? `/proxy/overlays/${gameId}/${gameId}.json`
    : `https://ti4.westaddisonheavyindustries.com/overlays/${gameId}/${gameId}.json`;

  return useQuery({
    queryKey: ["overlays", gameId],
    queryFn: () => fetch(apiUrl).then((res) => res.json()),
    retry: false,
  });
}

export const getOverlayContent = () => {

  const baseUrl =
    "https://cdn.statically.io/gh/AsyncTI4/TI4_map_generator_bot/master/src/main/resources/data";

  const factionSources = [
    "base",
    "ds",
    "franken",
    "ignisaurora",
    "keleres",
    "keleresplus",
    "memephilosopher",
    "miltymod",
    "other",
    "pbd2000",
    "pok",
    "project_pi",
  ];

  const publicObjectiveSources = [
    "little_omega",
    "miltymod",
    "project_pi",
    "public_objectives",
    "sigma",
  ];

  const agendaSources = [
    "absol",
    "base",
    "byz_agendas",
    "ignis_aurora",
    "little_omega",
    "miltymod",
    "pok",
    "project_pi",
    "sigma",
    "voices_of_the_council",
  ];

  const techSources = [
    "absol",
    "admins",
    "ds",
    "flagshipping",
    "ignis_aurora",
    "keleresplus",
    "miltymod",
    "nomadfalcon",
    "pbd2000",
    "pok",
    "project_pi",
  ];

  const leaderSources = [
    "admins",
    "ds",
    "generic",
    "ignis_aurora",
    "keleresplus",
    "pbd2000",
    "pok",
    "project_pi",
    "voices_of_the_council",
  ];

  const secretObjectiveSources = [
    "little_omega",
    "miltymod",
    "project_pi",
    "secret_objectives",
    "sigma",
  ];

  const pnSources = [
    "absol",
    "color",
    "drahn",
    "ds",
    "miltymod",
    "other",
    "pbd2000",
    "project_pi",
    "promises_promises",
    "promissory_notes",
  ];

  const relicSources = [
    "absol",
    "codexii",
    "dane_leaks",
    "ds",
    "fake_relics",
    "ignis_aurora",
    "pbd100",
    "pok",
    "project_pi",
    "sigma",
  ];

  const abilitySources = [
    "base",
    "ds",
    "keleresplus",
    "miltymod",
    "other",
    "pbd2000",
    "pok",
    "project_pi",
  ];

  const strategyCardSources = [
    "alexg9830",
    "anarchy",
    "grouped",
    "ignisaurora",
    "luminous",
    "manytech",
    "miltymod",
    "obsolete",
    "pok",
    "project_pi",
    "salliance",
    "tispoon",
    "tribunal",
    "voices_of_the_council",
    "monuments",
    "unfulvio",
  ];

  const unitSources = [
    "absol",
    "admins",
    "baseUnits",
    "drahn",
    "ds",
    "flagshipping",
    "ignis_aurora",
    "keleres",
    "lazax",
    "miltymod",
    "pbd2000",
    "pok",
    "project_pi",
  ];

  const exploreSources = [
    "asteroid",
    "codex3",
    "explores",
    "project_pi",
    "sigma",
    "uncharted_space",
  ];

  const fetchUrls = [
    ...factionSources.map((source) => `${baseUrl}/factions/${source}.json`),
    ...publicObjectiveSources.map((source) => `${baseUrl}/public_objectives/${source}.json`),
    ...agendaSources.map((source) => `${baseUrl}/agendas/${source}.json`),
    ...techSources.map((source) => `${baseUrl}/technologies/${source}.json`),
    ...leaderSources.map((source) => `${baseUrl}/leaders/${source}.json`),
    ...secretObjectiveSources.map((source) => `${baseUrl}/secret_objectives/${source}.json`),
    ...pnSources.map((source) => `${baseUrl}/promissory_notes/${source}.json`),
    ...relicSources.map((source) => `${baseUrl}/relics/${source}.json`),
    ...abilitySources.map((source) => `${baseUrl}/abilities/${source}.json`),
    ...strategyCardSources.map((source) => `${baseUrl}/strategy_cards/${source}.json`),
    ...unitSources.map((source) => `${baseUrl}/units/${source}.json`),
    ...exploreSources.map((source) => `${baseUrl}/explores/${source}.json`),
  ];

  console.log("fetchUrls", fetchUrls[0]);

  // this is such a dumb way of doing this lol
  const dataSourcePrefixes = [
    ...Array(factionSources.length).fill("FactionModel"),
    ...Array(publicObjectiveSources.length).fill("PublicObjectiveModel"),
    ...Array(agendaSources.length).fill("AgendaModel"),
    ...Array(techSources.length).fill("TechnologyModel"),
    ...Array(leaderSources.length).fill("LeaderModel"),
    ...Array(secretObjectiveSources.length).fill("SecretObjectiveModel"),
    ...Array(pnSources.length).fill("PromissoryNoteModel"),
    ...Array(relicSources.length).fill("RelicModel"),
    ...Array(abilitySources.length).fill("AbilityModel"),
    ...Array(strategyCardSources.length).fill("StrategyCardModel"),
    ...Array(unitSources.length).fill("UnitModel"),
    ...Array(exploreSources.length).fill("ExploreModel"),
  ];


  return Promise.all(
    fetchUrls.map((url) =>
      fetch(url)
        .then((res) => {
          if (!res.ok) {
            console.warn(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
            return null;
          }
          return res.json();
        })
        .catch((error) => {
          console.warn(`Error fetching ${url}:`, error);
          return null;
        })
    )
  ).then((results) => {
    let accumulator = {};
    results.forEach((dataArray, idx) => {
      // Skip null results from failed fetches
      if (dataArray === null) {
        console.warn(`Skipping failed fetch for ${fetchUrls[idx]}`);
        return;
      }

      const currentPrefix = dataSourcePrefixes[idx];
      Object.values(dataArray).forEach((data) => {
        const key = data.alias ?? data.id;
        accumulator[`${currentPrefix}:${key}`] = data;
      });
    });
    return accumulator;

  });
};

export function useOverlayContent() {
  return useQuery({
    queryKey: ["overlayContent"],
    queryFn: getOverlayContent,
    retry: false,
  });
}
