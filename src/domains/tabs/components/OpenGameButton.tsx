import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";
import { ActionIcon, Button, Group, Popover, TextInput } from "@/ds";
import classes from "./HeaderMenu.module.css";

/**
 * Turns what the user typed into a game id. Accepts a bare id ("fow696") or a
 * pasted link to a game ("https://…/game/fow696/…"); ids are lowercase.
 */
function parseGameId(input: string): string | null {
  const trimmed = input.trim();
  const fromUrl = trimmed.match(/\/(?:game|embed)\/([\w-]+)/)?.[1];
  const id = (fromUrl ?? trimmed).toLowerCase();
  return /^[\w-]+$/.test(id) ? id : null;
}

/**
 * A game-id field that opens that game. Visiting a game adds it to the open
 * tabs, so this is how a game you aren't seated in becomes a tab.
 */
export function OpenGameForm({
  onOpen,
  autoFocus,
  fill,
}: {
  onOpen?: () => void;
  autoFocus?: boolean;
  /** Stretch the field across the row instead of a fixed width. */
  fill?: boolean;
}) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const gameId = parseGameId(value);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!gameId) return;
        setValue("");
        onOpen?.();
        navigate(`/game/${gameId}`);
      }}
    >
      <Group gap="xs" wrap="nowrap">
        <TextInput
          size="xs"
          autoFocus={autoFocus}
          placeholder="Game id, e.g. fow696"
          aria-label="Game id"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setValue(event.currentTarget.value)
          }
          w={fill ? undefined : 180}
          flex={fill ? 1 : undefined}
        />
        <Button type="submit" size="xs" disabled={!gameId}>
          Open
        </Button>
      </Group>
    </form>
  );
}

/** "+" next to the open-game tabs: opens a game by its id as a new tab. */
export function OpenGameButton() {
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      offset={4}
      zIndex="var(--z-header-menu)"
    >
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          size="md"
          aria-label="Open a game by id"
          title="Open a game by id"
          className={classes.openGameButton}
          onClick={() => setOpened((o) => !o)}
        >
          <IconPlus size={16} />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown className={classes.dropdown} p={8}>
        <OpenGameForm autoFocus onOpen={() => setOpened(false)} />
      </Popover.Dropdown>
    </Popover>
  );
}
