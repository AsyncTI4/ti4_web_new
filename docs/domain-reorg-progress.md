# Domain Reorganization Progress

Date: 2026-02-22

## Summary

Completed a full domain-folder reorganization with old-UI isolation under `src/image-map`, shared UI extraction, and a final cross-domain component nesting flatten pass.

## Major Completed Work

1. Entities layer
- `src/data/**` -> `src/entities/data/**`
- `src/lookup/**` -> `src/entities/lookup/**`

2. Domain slices
- `map`, `player`, `objectives`, `game-shell`, `settings`, `changelog` migrated under `src/domains/**`

3. Shared/app extraction
- Shared UI/types/a11y moved under `src/shared/**`
- App providers moved under `src/app/providers/**`

4. Old UI isolation
- Added top-level `src/image-map/**`
- Moved old image-map UI files there
- Kept shared files out of `image-map` and centralized in shared UI

5. Straggler cleanup
- Moved remaining straggler components into explicit domain/shared folders
- Removed legacy top-level `src/components`

## Component Nesting Flatten Pass (Completed)

Goal:
- Avoid `domain/components/ComponentA/ComponentB` wrapper nesting.
- Make `ComponentB` a sibling of `ComponentA` at the domain components layer.

Wrapper removals:
- `src/domains/game-shell/components/{General,main}`
- `src/domains/map/components/{Map,MapView,try-decals}`
- `src/domains/objectives/components/Objectives`
- `src/domains/player/components/PlayerArea`
- `src/domains/settings/components/SettingsModal`
- `src/domains/changelog/components/ChangeLogModal`

Additional flattening:
- `src/domains/game-shell/components/chrome/PanelToggleButton` -> `src/domains/game-shell/components/PanelToggleButton`
- `src/domains/player/components/composition/PlayerCardBox` -> `src/domains/player/components/PlayerCardBox`
- `src/domains/objectives/components/PlayerScoreSummary/ObjectiveChip` -> `src/domains/objectives/components/ObjectiveChip`
- Inlined nested helper folders:
  - `src/domains/map/components/UnitStack/{hooks,utils}` (files moved into `UnitStack/`)
  - `src/domains/objectives/components/PlayerScoreSummary/{constants,utils}` (files moved into `PlayerScoreSummary/`)

## Validation

- `find src/domains -type d -path '*/components/*/*'` -> empty
- `yarn type-check` -> passed
- `yarn build` -> passed

## Single-TSX Folder Flatten Pass (Completed)

Rule applied:
- Any folder containing exactly one `.tsx` file (with optional `index.ts` only) was flattened by moving the `.tsx` file up one level and removing the wrapper folder.

Result:
- Flattened 45 additional folders across `src/domains/**` and `src/shared/ui/**`.
- Rewrote stale imports from old `Folder/File` paths to flattened paths.
- Fixed moved-file relative imports (`../` -> `./`) where needed.
- `yarn type-check` and `yarn build` both pass after the pass.

Residual single-tsx folder scan:
- `src/domains/settings` is the only remaining match in a full-repo scan; this is the domain root itself (not a nested component wrapper), so it was intentionally left intact.

## Notes

- Updated stale imports and domain index/barrel exports to the new flattened layout.
- Updated old image-map shared dependency paths to `src/shared/ui/map/**`.

## Gameplay Fixes

- Fleet token "double fleet" rendering is no longer tied to `letnev` faction identity.
- It is now driven by player-owned capability:
  - `abilities` containing `armada`, or
  - `techs`/`factionTechs` containing `armada` or `tf-armada`.
- Implemented by adding `hasArmadaBonus` to `CommandTokenStack` and computing it from `PlayerData` in `PlayerStatsArea`.
