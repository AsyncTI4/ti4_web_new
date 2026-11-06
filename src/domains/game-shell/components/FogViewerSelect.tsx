import { Select, Text } from "@/ds";
import { usePlayerData } from "@/api/usePlayerData";
import { useFogViewAs } from "@/api/useFogViewAs";

const WHOLE_GAME = "__whole_game__";

type Props = {
  gameId: string;
};

/**
 * Fog of War only. A GM picks whose eyes the map is drawn through (or the whole
 * game); a player is told whose view they are looking at.
 */
export function FogViewerSelect({ gameId }: Props) {
  const { data: fogView } = usePlayerData(gameId, {
    select: (data) => data.fogView,
  });
  const [viewAs, setViewAs] = useFogViewAs();

  if (!fogView) return null;

  if (fogView.role === "player") {
    return (
      <Text size="xs" c="dimmed" visibleFrom="sm">
        Fog of War · {fogView.viewingAs}
      </Text>
    );
  }

  const options = [
    { value: WHOLE_GAME, label: "GM · whole game" },
    ...(fogView.seats ?? []).map((seat) => ({
      value: seat.faction,
      label: `View as ${seat.userName} (${seat.faction})`,
    })),
  ];

  return (
    <Select
      size="xs"
      w={240}
      data={options}
      value={viewAs ?? WHOLE_GAME}
      onChange={(value) =>
        setViewAs(!value || value === WHOLE_GAME ? null : value)
      }
      aria-label="View the map as"
    />
  );
}
