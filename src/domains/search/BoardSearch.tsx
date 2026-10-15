import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ActionIcon, Box } from "@/ds";
import {
  IconChevronDown,
  IconChevronUp,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import cx from "clsx";
import { useGameData } from "@/state/useGameContext";
import {
  buildSearchIndex,
  findSearchEntries,
  SEARCH_KIND_LABELS,
  type SearchEntry,
} from "./searchIndex";
import {
  findSearchHits,
  focusSearchHit,
  useSearchHighlight,
} from "./searchHits";
import type { SearchKey } from "./searchKeys";
import classes from "./BoardSearch.module.css";

/** Which hit of the committed result is in view; `nonce` re-focuses the same hit. */
type Cursor = { key: SearchKey; index: number; nonce: number };

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    (target instanceof HTMLElement && target.isContentEditable)
  );
}

/**
 * Find anything on the board or in the player areas by name. Typing previews
 * the best match's highlights; Enter commits it and jumps to the first place
 * it appears, and each further Enter (or the arrows) steps to the next one —
 * the map first, then every player area that holds it.
 */
export function BoardSearch() {
  const gameData = useGameData();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const [query, setQuery] = useState("");
  const [listOpen, setListOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [cursor, setCursor] = useState<Cursor | null>(null);
  const [hitCount, setHitCount] = useState<number | null>(null);

  const index = useMemo(
    () => (gameData ? buildSearchIndex(gameData) : []),
    [gameData],
  );
  const results = useMemo(
    () => findSearchEntries(index, query),
    [index, query],
  );

  const highlightedIndex = Math.min(highlighted, results.length - 1);
  const highlightedEntry = listOpen ? results[highlightedIndex] : undefined;
  const showList = listOpen && query.trim().length > 0;
  useSearchHighlight(highlightedEntry?.key ?? cursor?.key ?? null);

  useEffect(() => {
    if (!cursor) return;
    const hits = findSearchHits(cursor.key);
    setHitCount(hits.length);
    if (hits.length === 0) return;
    focusSearchHit(hits[Math.min(cursor.index, hits.length - 1)]);
  }, [cursor]);

  useEffect(() => {
    function handleShortcut(event: globalThis.KeyboardEvent) {
      const isModK =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
      const isSlash =
        event.key === "/" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !isTypingTarget(event.target);
      if (!isModK && !isSlash) return;

      event.preventDefault();
      inputRef.current?.focus();
      inputRef.current?.select();
    }

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const commit = (entry: SearchEntry) => {
    setQuery(entry.label);
    setListOpen(false);
    setHitCount(null);
    setCursor((current) => ({
      key: entry.key,
      index: 0,
      nonce: (current?.nonce ?? 0) + 1,
    }));
  };

  const step = (delta: number) => {
    if (!cursor) return;
    const count = findSearchHits(cursor.key).length;
    if (count === 0) {
      setHitCount(0);
      return;
    }
    setCursor({
      key: cursor.key,
      index: (cursor.index + delta + count) % count,
      nonce: cursor.nonce + 1,
    });
  };

  const clear = () => {
    setQuery("");
    setListOpen(false);
    setCursor(null);
    setHitCount(null);
  };

  const handleChange = (value: string) => {
    setQuery(value);
    setListOpen(true);
    setHighlighted(0);
    setCursor(null);
    setHitCount(null);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (!showList || results.length === 0) return;
      event.preventDefault();
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setHighlighted((highlightedIndex + delta + results.length) % results.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (highlightedEntry) {
        commit(highlightedEntry);
        return;
      }
      step(event.shiftKey ? -1 : 1);
      return;
    }

    if (event.key !== "Escape") return;
    event.preventDefault();
    if (showList) {
      setListOpen(false);
      return;
    }
    clear();
    inputRef.current?.blur();
  };

  const counter =
    hitCount === null
      ? null
      : hitCount === 0
        ? "not shown"
        : `${cursor!.index + 1}/${hitCount}`;

  return (
    <Box className={classes.root} role="search">
      <Box className={cx(classes.field, cursor && classes.fieldEngaged)}>
        <IconSearch size={14} className={classes.searchIcon} aria-hidden />
        <input
          ref={inputRef}
          className={classes.input}
          value={query}
          placeholder="Search board"
          spellCheck={false}
          autoComplete="off"
          role="combobox"
          aria-label="Search the board and player areas"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showList && highlightedEntry
              ? `${listId}-${highlightedIndex}`
              : undefined
          }
          onChange={(event) => handleChange(event.currentTarget.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setListOpen(!cursor && query.trim().length > 0)}
          onBlur={() => setListOpen(false)}
        />

        {counter && (
          <span
            className={cx(classes.counter, hitCount === 0 && classes.counterEmpty)}
            aria-live="polite"
          >
            {counter}
          </span>
        )}
        {cursor && (
          <>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              aria-label="Previous match"
              title="Previous match (Shift+Enter)"
              disabled={!hitCount}
              onClick={() => step(-1)}
            >
              <IconChevronUp size={14} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              aria-label="Next match"
              title="Next match (Enter)"
              disabled={!hitCount}
              onClick={() => step(1)}
            >
              <IconChevronDown size={14} />
            </ActionIcon>
          </>
        )}
        {query ? (
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            aria-label="Clear search"
            title="Clear search (Esc)"
            onClick={clear}
          >
            <IconX size={14} />
          </ActionIcon>
        ) : (
          <kbd className={classes.kbd} aria-hidden>
            /
          </kbd>
        )}
      </Box>

      {showList && (
        <Box id={listId} role="listbox" className={classes.results}>
          {results.length === 0 && (
            <div className={classes.empty}>Nothing in this game matches</div>
          )}
          {results.map((entry, entryIndex) => (
            <div
              key={entry.key}
              id={`${listId}-${entryIndex}`}
              role="option"
              aria-selected={entryIndex === highlightedIndex}
              className={cx(
                classes.option,
                entryIndex === highlightedIndex && classes.optionActive,
              )}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setHighlighted(entryIndex)}
              onClick={() => commit(entry)}
            >
              <span className={classes.kind}>
                {SEARCH_KIND_LABELS[entry.kind]}
              </span>
              <span className={classes.label}>{entry.label}</span>
              {entry.detail && (
                <span className={classes.detail}>{entry.detail}</span>
              )}
            </div>
          ))}
        </Box>
      )}
    </Box>
  );
}
