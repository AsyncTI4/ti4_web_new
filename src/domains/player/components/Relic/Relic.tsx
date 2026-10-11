import { getRelicData } from "@/entities/lookup/relics";
import { RelicCard } from "./RelicCard";
import styles from "./Relic.module.css";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { useDisclosure } from "@/hooks/useDisclosure";
import { cdnImage } from "@/entities/data/cdnImage";
import {
  ObjectGlyph,
  ObjectLabel,
  ObjectShell,
} from "@/domains/player/components/silhouettes/ObjectShell";

type Props = {
  relicId: string;
  isExhausted?: boolean;
};

/** Artifact silhouette: a gold chamfered octagon with a glint on hover. */
export function Relic({ relicId, isExhausted = false }: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const relicData = getRelicData(relicId);

  if (!relicData) return null;

  const isFake = relicData.isFakeRelic ?? false;
  const state = isFake ? "frontier" : isExhausted ? "exhausted" : undefined;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <ObjectShell
          className={styles.relic}
          state={state}
          label={isExhausted ? `${relicData.name} (exhausted)` : relicData.name}
          onClick={toggle}
        >
          <ObjectGlyph
            src={
              isFake
                ? cdnImage("/tokens/token_frontier.webp")
                : "/relicicon.webp"
            }
            size={16}
          />
          <ObjectLabel>{relicData.name}</ObjectLabel>
        </ObjectShell>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <RelicCard relicId={relicId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
