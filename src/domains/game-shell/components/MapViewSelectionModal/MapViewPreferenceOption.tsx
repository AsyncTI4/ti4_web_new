import type { ReactNode } from "react";
import type { MapViewPreference } from "@/utils/mapViewPreference";
import classes from "./MapViewSelectionModal.module.css";

type MapViewPreferenceOptionProps = {
  icon: ReactNode;
  label: string;
  tagline: string;
  description: string;
  value: MapViewPreference;
  selected: boolean;
  onSelect: (value: MapViewPreference) => void;
};

/** A miniature of the layout: which area is the board, which are the side areas. */
function Schematic({ value }: { value: MapViewPreference }) {
  return (
    <span className={classes.schem} data-layout={value} aria-hidden>
      <i data-board />
      <i />
      <i />
    </span>
  );
}

export function MapViewPreferenceOption({
  icon,
  label,
  tagline,
  description,
  value,
  selected,
  onSelect,
}: MapViewPreferenceOptionProps) {
  return (
    <button
      type="button"
      className={classes.choice}
      aria-pressed={selected}
      onClick={() => onSelect(value)}
    >
      <Schematic value={value} />
      <b className={classes.choiceTitle}>
        {icon}
        {label}
      </b>
      <span className={classes.tagline}>{tagline}</span>
      <small className={classes.choiceText}>{description}</small>
    </button>
  );
}
