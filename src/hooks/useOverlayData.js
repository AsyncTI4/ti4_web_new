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
    "https://raw.githubusercontent.com/AsyncTI4/TI4_map_generator_bot/refs/heads/master/src/main/resources/data";

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
    "voice_of_the_council",
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
    "voice_of_the_council",
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
    "voice_of_the_council",
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
    "qulane"
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

  // this is such a dumb way of doing this lol
  const dataSourcePrefixes = [
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
    fetchUrls.map((url) => fetch(url).then((res) => res.json()))
  ).then((results) => {

    let accumulator = {};
    results.forEach((dataArray, idx) => {
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
