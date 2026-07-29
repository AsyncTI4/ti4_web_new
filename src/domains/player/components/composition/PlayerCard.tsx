import { PlayerData } from "@/entities/data/types";
import { usePlayerCardComputedData } from "@/domains/player/components/PlayerCardShared/usePlayerCardComputedData";
import { getPlayerCardLayoutFields } from "@/domains/player/components/PlayerCardShared/getPlayerCardLayoutFields";
import { PlayerCardDeck } from "@/domains/player/components/PlayerCardShared/PlayerCardDeck";
import { PlayerCardBox } from "@/domains/player/components/PlayerCardBox";
import { PlayerCardHeaderFull } from "@/domains/player/components/PlayerCardHeader/PlayerCardHeaderCompact";
import { useSettingsStore } from "@/utils/appStore";

type Props = {
  playerData: PlayerData;
};

/**
 * The Player tab's expanded card: the full-size header over the shared
 * compartment deck. The deck reflows itself to the card's width, so this
 * composition owns nothing but the enclosure and the header.
 */
export default function PlayerCard(props: Props) {
  const settings = useSettingsStore((state) => state.settings);
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
      <PlayerCardHeaderFull
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
        neighbors={player.neighbors}
        showNeighbors={settings.showPlayerAreaNeighborship}
      />

      <PlayerCardDeck playerData={props.playerData} />
    </PlayerCardBox>
  );
}
