import { cdnImage } from "@/entities/data/cdnImage";
import type { EntryType } from "@/entities/data/types";

export const OBJECTIVE_IMAGE_MAP: Record<EntryType, string> = {
  PO_1: cdnImage("/general/Public1.png"),
  PO_2: cdnImage("/general/Public2.png"),
  SECRET: cdnImage("/general/Secret_regular.png"),
  CUSTODIAN: cdnImage("/tokens/token_custodianvp.webp"),
  IMPERIAL: cdnImage("/tokens/token_custodianvp.webp"),
  CROWN: cdnImage("/general/Relic.png"),
  LATVINIA: cdnImage("/general/Relic.png"),
  SFTT: cdnImage("/general/Promissory.png"),
  SHARD: cdnImage("/general/Relic.png"),
  STYX: cdnImage("/tokens/token_custodianvp.webp"),
  AGENDA: cdnImage("/general/Agenda.png"),
};
