import type { AbilityKind } from "@/entities/lookup/abilities";

const HEX = "M8 1.6 13.6 4.8v6.4L8 14.4 2.4 11.2V4.8z";

/**
 * The hex every ability is seated in, filled by how it is used: solid when it
 * is always on, a bolt when a timing window triggers it, a play arrow when it
 * is an action you take on your turn.
 */
export function AbilityMark({
  kind,
  className,
}: {
  kind: AbilityKind;
  className?: string;
}) {
  if (kind === "passive") {
    return (
      <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
        <path d={HEX} fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden="true">
      <path d={HEX} fill="none" stroke="currentColor" strokeWidth="1.4" />
      {kind === "action" ? (
        <path d="M6.5 5.3v5.4L10.9 8z" fill="currentColor" />
      ) : (
        <path d="M8.9 3.9 5.6 8.6h2.3l-.7 3.5 3.3-4.8H8.2z" fill="currentColor" />
      )}
    </svg>
  );
}

export const ABILITY_KIND_LABEL: Record<AbilityKind, string> = {
  action: "Action",
  triggered: "Triggered",
  passive: "Passive",
};
