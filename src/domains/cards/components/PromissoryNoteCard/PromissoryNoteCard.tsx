import { Image } from "@/ds";
import { LeaderPortraitImage } from "@/shared/ui/LeaderPortraitImage";
import { getPromissoryNoteData } from "@/entities/lookup/promissoryNotes";
import { getAllianceCommander } from "@/entities/lookup/leaders";
import { useFactionColors } from "@/hooks/useFactionColors";
import { useGameData } from "@/state/useGameContext";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { FactionIcon } from "@/shared/ui/FactionIcon";
import { getLeaderPortraitUrl } from "@/entities/lookup/leaderPortraits";
import { resolvePromissoryNoteText } from "@/entities/game/playerUtils";
import styles from "./PromissoryNoteCard.module.css";

type Props = {
  promissoryNoteId: string;
};

type Commander = NonNullable<ReturnType<typeof getAllianceCommander>>;

function CommanderAbility({ commander }: { commander: Commander }) {
  return (
    <div className={styles.commander}>
      {getLeaderPortraitUrl(commander.id) && (
        <LeaderPortraitImage
          leaderId={commander.id}
          className={styles.portrait}
        />
      )}
      <div className={styles.commanderText}>
        <span className={styles.commanderName}>{commander.name}</span>
        {commander.abilityWindow && (
          <span className={styles.window}>{commander.abilityWindow}</span>
        )}
        <p>{commander.abilityText}</p>
      </div>
    </div>
  );
}

export function PromissoryNoteCard({ promissoryNoteId }: Props) {
  const factionColorMap = useFactionColors();
  const gameData = useGameData();
  const noteData = getPromissoryNoteData(promissoryNoteId, factionColorMap);

  if (!noteData) return null;

  const displayName = noteData.noteData.shortName || noteData.displayName;
  const displayText = resolvePromissoryNoteText(
    noteData.noteData.text,
    noteData,
    gameData?.playerData
  );

  const isAlliance =
    noteData.noteData.alias.includes("_an") ||
    noteData.noteData.name.toLowerCase() === "alliance";

  // Resolve the actual commander in play for alliance notes. Some variants share a
  // faction key (for example Ghosts/Red Creuss), so a plain faction match can pick
  // the wrong leader data.
  const commander = isAlliance
    ? getAllianceCommander(
        noteData.faction,
        gameData?.playerData.find((player) => player.faction === noteData.faction)
          ?.leaders
      )
    : undefined;

  const tileGlyph = noteData.faction ? (
    <FactionIcon faction={noteData.faction} w={28} h={28} />
  ) : (
    <Image src="/pnicon.png" alt="" />
  );

  return (
    <DetailsCard width={340} color="cyan">
      <DetailsCard.Title
        title={displayName}
        type="Promissory note"
        meta={[noteData.faction]}
        icon={<DetailsCard.Icon shape="pn" icon={tileGlyph} />}
      />
      {isAlliance && commander && (
        <DetailsCard.Section
          title="Commander ability"
          content={<CommanderAbility commander={commander} />}
        />
      )}
      <DetailsCard.Section content={displayText} />
    </DetailsCard>
  );
}
