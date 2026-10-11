import type { ReactNode } from "react";
import {
  IconBook2,
  IconCrown,
  IconDiamond,
  IconGavel,
  IconShield,
  IconPlanet,
} from "@tabler/icons-react";
import type { EntryState, EntryType } from "@/entities/data/types";

export type ScoreSource = {
  label: string;
  /** Signal triplet the token is tinted with. */
  tone: string;
  glyph: { text: string } | { mask: string } | { icon: ReactNode };
};

const icon = (node: ReactNode) => ({ icon: node });

/** Where a point comes from: its name, its signal colour and the glyph it carries. */
export const SCORE_SOURCES: Record<EntryType, ScoreSource> = {
  PO_1: { label: "Stage I objective", tone: "var(--ds-sig-stage1)", glyph: { text: "I" } },
  PO_2: { label: "Stage II objective", tone: "var(--ds-sig-stage2)", glyph: { text: "II" } },
  SECRET: { label: "Secret objective", tone: "var(--ds-sig-secret)", glyph: { mask: "/so_icon.png" } },
  CUSTODIAN: {
    label: "Custodians token",
    tone: "var(--ds-sig-custodians)",
    glyph: icon(<IconShield stroke={1.9} />),
  },
  IMPERIAL: { label: "Imperial", tone: "var(--ds-sig-imperial)", glyph: { text: "8" } },
  CROWN: {
    label: "The Crown of Emphidia",
    tone: "var(--ds-sig-relic)",
    glyph: icon(<IconCrown stroke={1.9} />),
  },
  LATVINIA: {
    label: "Book of Latvinia",
    tone: "var(--ds-sig-relic)",
    glyph: icon(<IconBook2 stroke={1.9} />),
  },
  SHARD: {
    label: "Shard of the Throne",
    tone: "var(--ds-sig-relic)",
    glyph: icon(<IconDiamond stroke={1.9} />),
  },
  SFTT: { label: "Support for the Throne", tone: "var(--ds-sig-pn)", glyph: { mask: "/pnicon.png" } },
  STYX: { label: "Styx", tone: "var(--ds-sig-break)", glyph: icon(<IconPlanet stroke={1.9} />) },
  AGENDA: { label: "Agenda", tone: "var(--ds-sig-law)", glyph: icon(<IconGavel stroke={1.9} />) },
};

export const STATE_LABEL: Record<EntryState, string> = {
  SCORED: "Scored",
  QUALIFIES: "Ready to score",
  POTENTIAL: "Possible",
  UNSCORED: "Possible",
};
