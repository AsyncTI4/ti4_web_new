import { PlayerData } from "@/entities/data/types";
import { usePlayerCardComputedData } from "@/domains/player/components/PlayerCardShared/usePlayerCardComputedData";
import { getPlayerCardLayoutFields } from "@/domains/player/components/PlayerCardShared/getPlayerCardLayoutFields";
import { PlayerCardDeck } from "@/domains/player/components/PlayerCardShared/PlayerCardDeck";
import { PlayerCardBox } from "@/domains/player/components/PlayerCardBox";
import { PlayerCardHeaderCompact } from "@/domains/player/components/PlayerCardHeader/PlayerCardHeaderCompact";

type Props = {
  playerData: PlayerData;
};

/**
 * The Panels-view sidebar dossier: the compact header over the same
 * compartment deck as the Player tab. The sidebar's width rides a drag
 * handle, and the deck's container queries reflow the compartments to
 * whatever width it lands on.
 */
export default function PlayerCardSidebar(props: Props) {
  const player = getPlayerCardLayoutFields(props.playerData);
  const { factionImageUrl: factionUrl } = usePlayerCardComputedData(
    props.playerData
  );

  return (
    <PlayerCardBox
      color={player.color}
      faction={player.faction}
      showFactionBackground={false}
      subtleBorder
      isActive={player.active}
    >
      <PlayerCardHeaderCompact
        userName={player.userName}
        faction={player.faction}
        factionDisplayName={player.factionDisplayName}
        color={player.color}
        factionImageUrl={factionUrl ?? ""}
        isSpeaker={player.isSpeaker}
        isTyrant={player.isTyrant}
        scs={player.scs}
        exhaustedSCs={player.exhaustedSCs}
        passed={player.passed}
        active={player.active}
      />

      <PlayerCardDeck playerData={props.playerData} />
    </PlayerCardBox>
  );
}
