when creating css styles use css modules when possible, using mantine css variables when applicable
prefer typescript types to interfaces
Avoid React.FC<> when defining component types
do not excessively add inline comments to methods.
jsdoc comments are good, but don't document the 'params' and 'return'
avoid excessive if/else/for loop nesting. more than 2 levels is bad. but even 2 levels is not ideal.
use early return guard clauses liberally to reduce nesting

## Design Context

Read `PRODUCT.md` (strategy) and `DESIGN.md` (visual system) before any UI work.

Register is **product**, platform **web**. The users are experienced TI4 players mid-game who want density over hand-holding, and the north star is "The Tactical Readout" — an instrument reporting a battlefield, where the map is the subject and everything else is calibration.

Load-bearing rules from those files:

- New visual values go in `src/styles/themeSharedTokens.css` as semantic tokens, overridden per theme. A hardcoded color breaks six of the seven themes.
- Signal colors (stage orange, secret red, relic gold, law purple, faction colors) mean the same thing in every theme. Themes own surfaces, borders, shadows and texture only.
- Product type is a fixed px scale (9/10/11/12/13/14/18px), never `clamp()`. All comparable numerals are mono.
- Data panels are flat; shadow is reserved for modals, drawers, dropdowns, tooltips and floating controls. Glow reports state, never decorates a surface.
- Stack with `var(--z-*)` from `src/utils/zIndexVariables.css` for anything above local sibling ordering.
- Style overlays by extending `src/styles/overlays.css` so all themes inherit the change.

Anti-references — never build toward these: generic SaaS dashboard, neon cyberpunk cliché (no gradient text, no decorative glass), cluttered fan-wiki, over-animated and floaty. See DESIGN.md's Do's and Don'ts for the specific violations still present in the codebase.