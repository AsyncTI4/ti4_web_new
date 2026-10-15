import type { ReactNode } from "react";
import { AppModal } from "@/shared/ui/AppModal";
import classes from "./KeyboardShortcutsModal.module.css";

type KeyboardShortcutsModalProps = {
  opened: boolean;
  onClose: () => void;
};

type Shortcut = {
  description: string;
  /** Each entry is one key; alternatives for the same action share an entry as "+ =". */
  keys: string[];
  /** A contiguous run, drawn with an ellipsis between its ends. */
  range?: boolean;
};

const NAVIGATION: Shortcut[] = [
  { description: "Toggle both sidebars", keys: ["h"] },
  { description: "Left / right sidebar", keys: ["l", "r"] },
  { description: "Zoom in / out", keys: ["+", "=", "-"] },
  { description: "Tech skip rendering", keys: ["t"] },
  { description: "Attachments mode", keys: ["a"] },
  { description: "Overlays", keys: ["o"] },
  { description: "Search the board", keys: ["/", "Ctrl K"] },
  { description: "Next / previous match", keys: ["Enter", "Shift Enter"] },
];

const RIGHT_SIDEBAR: Shortcut[] = [
  { description: "Faction by seat", keys: ["1", "2", "3", "8"], range: true },
  { description: "Tech tab", keys: ["T"] },
  { description: "Hand tab", keys: ["H"] },
  { description: "Strength tab", keys: ["S"] },
];

function Keycap({ children }: { children: ReactNode }) {
  return <kbd className={classes.kbd}>{children}</kbd>;
}

function KeySequence({ keys, range }: Pick<Shortcut, "keys" | "range">) {
  if (!range) {
    return (
      <span className={classes.kseq}>
        {keys.map((key) => (
          <Keycap key={key}>{key}</Keycap>
        ))}
      </span>
    );
  }
  const head = keys.slice(0, -1);
  const last = keys[keys.length - 1];
  return (
    <span className={classes.kseq}>
      {head.map((key) => (
        <Keycap key={key}>{key}</Keycap>
      ))}
      <span className={classes.ellipsis} aria-label="through">
        …
      </span>
      <Keycap>{last}</Keycap>
    </span>
  );
}

function ShortcutColumn({ label, shortcuts }: { label: string; shortcuts: Shortcut[] }) {
  return (
    <section className={classes.column}>
      <div className={`overlay-modal-label ${classes.columnLabel}`}>{label}</div>
      {shortcuts.map((shortcut) => (
        <div key={shortcut.description} className={classes.krow}>
          <span>{shortcut.description}</span>
          <KeySequence keys={shortcut.keys} range={shortcut.range} />
        </div>
      ))}
    </section>
  );
}

export function KeyboardShortcutsModal({
  opened,
  onClose,
}: KeyboardShortcutsModalProps) {
  return (
    <AppModal
      opened={opened}
      onClose={onClose}
      title="Keyboard shortcuts"
      size={620}
      padding={0}
    >
      <div className="overlay-modal-content">
        <div className={classes.keys}>
          <ShortcutColumn label="Navigation & display" shortcuts={NAVIGATION} />
          <ShortcutColumn label="Right sidebar" shortcuts={RIGHT_SIDEBAR} />
        </div>
      </div>
      <footer className="overlay-modal-footer" data-align="start">
        <p className="overlay-modal-note">
          Press a key again to deselect. Shortcuts pause while you type.
        </p>
      </footer>
    </AppModal>
  );
}
