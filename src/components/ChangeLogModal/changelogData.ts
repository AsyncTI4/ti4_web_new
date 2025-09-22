import type { ChangeLogItem } from "./ChangeLogModal";

export const CURRENT_CHANGELOG_VERSION = "0.9.0";

export const CHANGELOG_090: ChangeLogItem = {
  version: CURRENT_CHANGELOG_VERSION,
  sections: [
    {
      title: "UI Improvements",
      items: [
        "All faction techs are now shown on the player card, not just unresearched ones",
        "Player areas should be more consistent in their layout, allowing easier cross comparison between players",
      ],
    },
    {
      title: "Bug fixes",
      items: [
        "Franken faction images are now supported",
        "Fix monuments not showing",
        "Fix PDS overlay showing above sidebars",
        "Fix PDS and Trait tab icons not rendering correclty on firefox",
        "PDS rendering mode now shows all PDS coverage, not just the faction with the highest PDS hit count.",
        "Excludes FoW games from auto-loaded tabs if authenticated",
        'Planets with planetary shields will now show the "planetary shield" icon',
      ],
    },
  ],
};
