import { cdnImage } from "./cdnImage";

export const TECH_COLOR_IMAGES = {
  blue: cdnImage("/emojis/tech/PropulsionTech.png"),
  green: cdnImage("/emojis/tech/BioticTech.png"),
  red: cdnImage("/emojis/tech/WarfareTech.png"),
  yellow: cdnImage("/emojis/tech/CyberneticTech.png"),
} as const;

export const UNIT_UPGRADE_IMAGE = cdnImage("/emojis/tech/UnitUpgradeTech.png");
export const ACTION_CARD_BACK = cdnImage("/player_area/pa_cardbacks_ac.png");
export const RESOURCE_IMAGE = cdnImage("/player_area/pa_resources.png");
