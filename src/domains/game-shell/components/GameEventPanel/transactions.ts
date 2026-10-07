import {
  prettifyId,
  resolveCardName,
  resolvePlanetName,
  resolveTechName,
} from "./eventFormatting";
import { pluralize } from "./eventPayload";

type TransactionItem = {
  sender: string;
  receiver: string;
  type: string;
  detail: string;
};

export type TransactionSide = {
  sender: string;
  items: string[];
};

function parseTransactionItem(item: string): TransactionItem | null {
  const parts = item.split("_");
  if (parts.length < 4) return null;
  const sender = parts[0].replace(/^sending/, "");
  const receiver = parts[1].replace(/^receiving/, "");
  const type = parts[2];
  const detail = parts.slice(3).join("_");
  if (!sender || !receiver || !type || !detail) return null;
  return { sender, receiver, type, detail };
}

function genericCount(detail: string): { label: string; count: number } {
  const match = detail.match(/^(.*?)(\d+)$/);
  if (!match) return { label: detail, count: 1 };
  return { label: match[1], count: Number(match[2]) };
}

function formatTransactionItem({
  type,
  detail,
}: TransactionItem): string | null {
  switch (type) {
    case "TGs":
      return pluralize(Number(detail), "trade good");
    case "Comms":
      return pluralize(Number(detail), "commodity", "commodities");
    case "ACs": {
      const { label, count } = genericCount(detail);
      return label === "generic"
        ? pluralize(count, "action card")
        : resolveCardName("CARD_PLAY_ACTION_CARD", detail);
    }
    case "PNs": {
      const { label, count } = genericCount(detail);
      return pluralize(label === "generic" ? count : 1, "promissory note");
    }
    case "SOs":
      return pluralize(genericCount(detail).count, "secret objective");
    case "Frags": {
      const { label, count } = genericCount(detail);
      return pluralize(count, `${prettifyId(label)} fragment`);
    }
    case "SendDebt":
      return pluralize(Number(detail), "debt token");
    case "ClearDebt":
      return `cleared ${pluralize(Number(detail), "debt token")}`;
    case "Planets":
    case "AlliancePlanets":
    case "dmz":
      return resolvePlanetName(detail.replace(/exhausted|refreshed/g, ""));
    case "Technology":
      return resolveTechName(detail);
    case "shipOrders":
    case "starCharts":
      return resolveCardName("CARD_PLAY_RELIC", detail);
    case "action":
      return `${prettifyId(detail)} action`;
    case "details":
      return null;
    default:
      return prettifyId(detail || type);
  }
}

/** Groups formatted items by sender, listing `from` then `to` first. */
export function transactionSides(
  rawItems: string[],
  from?: string,
  to?: string,
): TransactionSide[] {
  const bySender = new Map<string, string[]>();
  for (const raw of rawItems) {
    const item = parseTransactionItem(raw);
    const formatted = item && formatTransactionItem(item);
    if (!item || !formatted) continue;
    const items = bySender.get(item.sender) ?? [];
    items.push(formatted);
    bySender.set(item.sender, items);
  }

  const orderedSenders = [from, to].filter(
    (sender): sender is string => !!sender && bySender.has(sender),
  );
  for (const sender of bySender.keys()) {
    if (!orderedSenders.includes(sender)) orderedSenders.push(sender);
  }

  return orderedSenders.map((sender) => ({
    sender,
    items: bySender.get(sender) ?? [],
  }));
}
