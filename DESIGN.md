---
name: AsyncTI4
description: A tactical readout for asynchronous Twilight Imperium — instrument-grade chrome over a live galaxy map.
colors:
  graphite-ground: "#151517"
  graphite-field: "#0c0c0d"
  graphite-socket: "#050506"
  graphite-hairline: "#bebec4"
  deep-space: "#060a13"
  deep-space-surface: "#020617"
  deep-space-raised: "#0a111f"
  hull-slate: "#94a3b8"
  accent-blue: "#3b82f6"
  accent-blue-deep: "#2563eb"
  accent-blue-light: "#93c5fd"
  ink-bright: "#f1f3f5"
  ink: "#adb5bd"
  ink-muted: "#868e96"
  signal-red: "#ef4444"
  signal-green: "#22c55e"
  signal-cyan: "#06b6d4"
  signal-orange: "#f97316"
  signal-yellow: "#eab308"
  signal-teal: "#14b8a6"
  signal-purple: "#9333ea"
  rank-gold: "#ffd700"
  rank-silver: "#c0c0c0"
  rank-bronze: "#cd7f32"
typography:
  display:
    fontFamily: "var(--font-display)"
    fontSize: "3.25rem"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  heading:
    fontFamily: "var(--font-display)"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.02em"
  title:
    fontFamily: "var(--font-display)"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.09em"
  body:
    fontFamily: "var(--font-text)"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.01em"
  data:
    fontFamily: "var(--font-data)"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "normal"
  meta:
    fontFamily: "var(--font-text)"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.01em"
  label:
    fontFamily: "var(--font-display)"
    fontSize: "0.625rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
  micro:
    fontFamily: "var(--font-data)"
    fontSize: "0.5625rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "0.02em"
rounded:
  hairline: "1px"
  sharp: "2px"
  panel: "3px"
  sm: "4px"
  md: "6px"
  lg: "8px"
  pill: "999px"
spacing:
  hair: "2px"
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "12px"
  xxl: "16px"
components:
  surface:
    backgroundColor: "{colors.deep-space-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
  panel-field:
    backgroundColor: "{colors.deep-space-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "{spacing.md}"
  faction-tab:
    backgroundColor: "{colors.deep-space-surface}"
    rounded: "{rounded.hairline}"
    width: "44px"
    height: "36px"
  faction-tab-pinned:
    backgroundColor: "{colors.accent-blue}"
    height: "36px"
  header-tab:
    backgroundColor: "{colors.deep-space-surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.md}"
  header-tab-active:
    backgroundColor: "{colors.accent-blue-deep}"
    textColor: "{colors.ink-bright}"
  panel-toggle:
    backgroundColor: "{colors.deep-space-raised}"
    textColor: "{colors.ink}"
    width: "36px"
    height: "36px"
  overlay-modal:
    backgroundColor: "{colors.deep-space-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  overlay-tooltip:
    backgroundColor: "{colors.deep-space-surface}"
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    rounded: "{rounded.sm}"
    padding: "5px 10px"
  input-field:
    backgroundColor: "{colors.deep-space-surface}"
    textColor: "{colors.ink-bright}"
    rounded: "{rounded.sm}"
    padding: "{spacing.xs} {spacing.md}"
---

# Design System: AsyncTI4

## 1. Overview

**Creative North Star: "The Tactical Readout"**

This system is an instrument reporting a battlefield. The galaxy map is the subject; everything else is calibration. Hairlines, bracket corners, monospace numerals and 9–11px uppercase labels are the marks on the instrument's face — they exist to frame and index data, never to dress it. A player opens a game to find out what changed, and the interface's whole job is to let them read the board and get out.

Density is the operating condition, not a compromise. Type runs from 9px to 14px across most of the product, panels sit at 2–12px padding, and gaps step in 2px increments. That only works because the discipline is absolute: a fixed px scale, one radius vocabulary, one hairline alpha vocabulary, and semantic game colors that never shift meaning. **The system fails by becoming undisciplined, not by becoming boring.**

Identity lives in a seven-theme layer (`midnighttheme` and its blue / gray / red / violet / green siblings, plus `vaporwavetheme`) built entirely on top of a shared semantic token contract in `themeSharedTokens.css`. Themes may reinterpret surfaces, borders, ambience and texture. They may never reinterpret what a color *means*. This system explicitly rejects the **generic SaaS dashboard** (rounded cards on light gray, stat tiles, indigo accent), the **neon cyberpunk cliché** (gradient text, glow everywhere, decorative glass), the **cluttered fan-wiki** (dense but undesigned), and anything **over-animated or floaty** that delays reading the board.

**Key Characteristics:**
- Hueless graphite ground in the default theme (`midnightgraytheme`); a near-black blue field in the midnight themes
- Milled plates: a cut corner plus one pixel of top light and bottom shade, never a drop shadow on data
- A three-step depth order — card ground, module field, socket/trough
- Fixed px type scale, 9–18px in product surfaces; monospace for all numerals
- Tight radii (2–4px on data, 8px on overlays); hairline borders at 10–35% alpha
- Nine-color semantic signal vocabulary, fixed across all seven themes
- Reticle corner brackets and chamfered corners as the signature framing devices
- 0.2s transitions as the default; state-reporting motion only

## 2. Colors: Graphite and Deep Space

A near-black field under translucent hairline chrome, with a nine-color signal vocabulary that is the only saturated thing on screen.

**Two neutral families, and which one is default matters.** `midnightgraytheme` is the shipped default, and it is **hueless graphite** — Graphite Ground (`#151517`) for a card, Graphite Field (`#0c0c0d`) for the modules inside it, Graphite Socket (`#050506`) for troughs and empty slots, with Graphite Hairline (`#bebec4`) carrying the alpha ladder. The midnight themes (blue, red, violet, green) use the Deep Space navy family below, which is what `themeSharedTokens.css` defines as its fallback. A theme whose identity is hueless must override the whole machined-chrome block, or it inherits navy plates and reads as two products bolted together.

### Primary
- **Tactical Blue** (`#3b82f6`): The single interactive accent. Selection, active tabs, pinned factions, focus borders, threshold-met progress badges, and the ambient bloom at the top of the map field. Never decoration — if blue appears, something is selected, active, or crossing a threshold.
- **Tactical Blue Deep** (`#2563eb`): Hover and active fills on header tabs and nav chips, where the accent needs weight rather than a hairline.
- **Tactical Blue Light** (`#93c5fd`): Text and icons *on* blue-tinted surfaces (unit upgrade cards). Solves the washed-out-gray-on-color problem by staying in the background's own hue.

### Secondary
- **Hull Slate** (`#94a3b8`): The entire hairline vocabulary. Never used as a solid fill — it appears only as `rgba()` at four fixed strengths: separators at 10%, frames at 14%, strong frames at 22%, borders at 28%, and map-tab edges at 35%. This alpha ladder is the system's structural grammar.

### Tertiary
The signal vocabulary. Defined once as RGB triplets in `gradients.css` (`--gd-*`) and consumed through the `.gradient-{color}` utility classes, which apply a fixed alpha tier: backgrounds at 4–10%, borders at 16–30%, accents at 70%.

- **Signal Red** (`#ef4444`): Secret objectives, destructive and warning state.
- **Signal Green** (`#22c55e`): Active player, success, affirmative counts.
- **Signal Cyan** (`#06b6d4`) / **Signal Teal** (`#14b8a6`): Technology and resource categories.
- **Signal Orange** (`#f97316`): Stage I public objectives.
- **Signal Yellow** (`#eab308`): Trade goods, commodities, scored highlights.
- **Signal Purple** (`#9333ea`): Laws in play, agenda state, inherited unit stats.
- **Rank Gold / Silver / Bronze** (`#ffd700` / `#c0c0c0` / `#cd7f32`): Army ranking positions only.

### Neutral

- **Graphite Ground / Field / Socket** (`#151517` / `#0c0c0d` / `#050506`): The default theme's three depth steps — card, module, trough. Ground is deliberately the lightest; see the Three-Step Rule in Elevation.
- **Graphite Hairline** (`#bebec4`): The default theme's hairline vocabulary, used at the same alpha ladder as Hull Slate.
- **Deep Space** (`#060a13`): The midnight themes' map field and sidebar ground. The furthest-back plane.
- **Deep Space Surface** (`#020617`): Panels, cards and overlays, almost always as the start of a `135deg` gradient at 92–100% alpha so the map reads faintly beneath.
- **Deep Space Raised** (`#0a111f`): The end of that gradient, and the fill for floating controls.
- **Ink Bright** (`#f1f3f5`): Titles, modal headers, primary values. **13.4:1** on Deep Space.
- **Ink** (`#adb5bd`): The default text color and the most-used ink in the system. **9.5:1** on Deep Space.
- **Ink Muted** (`#868e96`): Secondary and supporting copy. **5.95:1** on Deep Space — the darkest ink permitted for text.

### Named Rules

**The Fixed Meaning Rule.** Stage orange, secret red, relic gold, law purple and faction colors mean the same thing in every one of the seven themes. Themes override surfaces, borders, shadows and texture. A theme that redefines a signal color is a bug, not a variant.

**The Alpha Ladder Rule.** Hull Slate appears at 10% (separator), 14% (frame), 22% (strong frame), 28% (border) or 35% (map-tab edge). Never invent a sixth value. Reach for the ladder step above or below instead.

**The Ink Floor Rule.** `#868e96` (Mantine `gray-6`) is the darkest text color allowed on Deep Space, at 5.95:1. `gray-7` (`#495057`) measures **2.47:1** and is forbidden for any text at any size.

## 3. Typography

**Display Font:** Slider (self-hosted woff2, `font-display: swap`) — `--font-display`
**Text Font:** IBM Plex Sans — `--font-text`
**Data Font:** IBM Plex Mono — `--font-data`

**Character:** Three families and only three. Slider is a squared, technical face that reads as console signage rather than sci-fi costume; it carries display, headings, panel titles and every uppercase label. IBM Plex Sans carries UI text: engineered rather than neutral, and it holds its counters at the 12–13px this interface actually runs at. IBM Plex Mono carries every numeral. Text and data share one superfamily so they sit together, while Slider contrasts against both on proportion **and** personality — a squared display face against an engineered text face is a real contrast axis, unlike two grotesques competing.

**What this replaced.** The UI ran on Mantine's default system stack, which is the single reason the interface read as generic; numerals were split across Space Mono, the system monospace and a hand-rolled SF Mono stack, so the same quantity looked different in three places; Geist Sans had leaked onto the landing page as a fourth voice; and `Slider, "Times New Roman", serif` appeared six times, so a failed display font fell back to a **serif**.

### Hierarchy

Every step is a **named role**, declared in `styles/typography.css`. Six near-identical sizes chosen ad hoc is what makes hierarchy muddy — not the sizes themselves. Sizes are `rem` so they honour the reader's browser setting; the dense 9–12px band is deliberate for a data surface.

- **Display** (`--text-display`, 52px, Slider): the landing hero only. Never in product surfaces.
- **Heading** (`--text-heading`, 18px, Slider 600): page and section headings.
- **Title** (`--text-title`, 14px, Slider 600, `--track-rail`): panel and modal titles, uppercase.
- **Body** (`--text-body`, 13px, Plex Sans, 1.5): prose — card text, objective and law descriptions, tooltips. Cap prose at 65–75ch.
- **Data** (`--text-data`, 12px, Plex Mono 500): every comparable numeral. Also the size of every chip label — tech, relics, promissory notes, abilities and secrets all sit here, in Plex Sans 600.
- **Meta** (`--text-meta`, 11px): timestamps, ratios, captions.
- **Label** (`--text-label`, 10px, Slider 700, `--track-label`): field labels, badge text, uppercase.
- **Micro** (`--text-micro`, 9px, Plex Mono): in-map unit counts and rail labels, bounded by the tile they sit on.

### Outside the ramp, on purpose

Two families of type sit outside the UI scale and should not be dragged onto it:

- **Map-canvas glyphs.** Tile numbers, faction plate numerals, production and commodity indicators and the VP readouts on the board are painted into a zoomable canvas that renders at ~40% by default. They are sized to the hex, not to the interface, which is why they run 22–64px in source. Forcing them onto the UI ramp would break the board's scale.
- **The landing page.** A brand surface with its own register, including the one place fluid `clamp()` display type is allowed.

One further accepted exception: `styles/fonts.css` declares `font-family: "Slider"` as a literal string. An `@font-face` family name cannot be a `var()` — it *is* the definition `--font-display` points at. A type scan will flag it; it is correct.

### Weights, tracking, leading

Four weight roles and no more: `--weight-regular` 400, `--weight-data` 500, `--weight-title` 600, `--weight-rail` 700. 700 next to 800 next to 900 is not distinguishable at 10px, and having all three is how a system loses its voice.

Three tracking roles, all in `em` so they scale with the size: `--track-rail` 0.09em, `--track-label` 0.06em, `--track-body` 0.01em. Tracking used to be split across `px` and `em` in 28 distinct values, which meant the same nominal tracking meant different things at 9px and 18px.

`--lh-flush` 1 is for single-line numerals **only**; anything that can wrap takes `--lh-body` 1.5. Light text on a dark field loses perceived weight, so body prose takes the open track and steps up a weight rather than sitting at regular.

### Named Rules

**The Fixed Meaning Rule.** Stage orange, secret red, relic gold, law purple and faction colors mean the same thing in every one of the seven themes. Themes override surfaces, borders, shadows and texture. A theme that redefines a signal color is a bug, not a variant.

**The Mono-Is-Numerals Rule.** Mono is for quantities a player compares, never for names. Tech names, planet names and ability labels were set in a monospace face; a name in mono costs real legibility and says nothing. If it isn't a number, it belongs in `--font-text`.

**The One-Chip-Size Rule.** Every chip label — tech, relic, promissory note, ability, secret — is `--text-data` at `--weight-title`. Mantine's `fw` prop emits an inline style that beats a CSS class, so chip weight has to be set at the component, not in CSS. Bold plus a text-shadow at 12px turns Plex Sans to mush; semibold with a light shadow does not.

**The Named Container Rule.** Uppercase tracked text names a container (panel, modal, surface). It never introduces a section as a kicker above a heading.

**The Ladder-Is-Not-The-Roles Rule.** Mantine's `fontSizes` ladder keeps its original values (xs 12 / sm 14 / md 16 / lg 18 / xl 20). It is **not** remapped onto the semantic roles: `xs` is used in 139 places as the chip and body size, and folding it onto the 10px label role shrank every chip label in the app. The roles are for CSS modules; the ladder is for component props.

## 4. Elevation

Depth is split by function: **milled data, lifted overlays.** Data panels are not flat — they are *shallow*. Each plate carries one pixel of top light and one pixel of bottom shade (`--machined-bevel`), which reads as material thickness, plus a cut corner (`--machined-chamfer`) that catches a brighter wedge along the bevel. What data panels never carry is a **drop shadow**: that is reserved for surfaces which genuinely float above the board.

The distinction matters because "flat" and "no drop shadow" are not the same instruction. Flat panels made the player area read as parts scattered on a void; the fix was thickness measured in single pixels, not shadow.

Within a plate, depth runs in three steps, and the order is load-bearing:

1. **Ground** — the card itself (`--player-card-box-bg`), the lightest step. The player area is one enclosure.
2. **Field** — modules sitting inside it (`--panel-field-bg`), a step darker, so a module reads as a recessed subpanel rather than a card floating on black.
3. **Socket / trough** — the darkest step (`--socket-bg`, `--trough-bg`), pressed into the field, holding either empty capacity or a seated numeric readout.

Glow is not elevation at all; it belongs exclusively to state.

### Named Rules

**The Milled Data Rule.** Data panels get a one-pixel bevel and a cut corner, never a drop shadow. Shadow is reserved for modals, drawers, dropdowns, tooltips and floating controls.

**The Three-Step Rule.** Ground is lighter than field; field is lighter than socket. If a plate is darker than the surface it sits on, the hierarchy is inverted and the panel will read as a hole.

**The Glow-Is-State Rule.** Glow reports a condition — this player is active, this objective is at threshold, this unit is upgraded. A glow on a surface at rest is the neon cyberpunk anti-reference.

**The Cheap Corner Rule.** A plate's cut corner is painted as a small gradient triangle in `--plate-ground`, never carved with `clip-path`. `clip-path` on a large element forces an uncomposited repaint every frame; with ~60 plates on screen it measured **39.9ms per frame (25fps)** while scrolling, against **12.5ms (80fps)** without. Only plates floating over arbitrary content — where no single ground colour exists to paint in — may clip, and there should never be more than a handful of those on screen at once (`Module`'s `overContent` prop). Every theme must declare `--plate-ground` to match its `--player-card-box-bg`, or the notch shows as a visible wedge.

**The Empty-Is-A-Socket Rule.** Empty capacity — an unresearched tech, a unit unavailable to a faction, a sealed secret — is drawn as a recessed socket with walls. Never a dashed outline: dashed reads as unfinished layout, not as an empty slot.

### Machined Vocabulary

- **Bevel** (`--machined-bevel`): `inset 0 1px 0` light over `inset 0 -1px 0` shade. On every plate, bay and stores chip. The whole trick.
- **Chamfer** (`--machined-chamfer` 9px, `--machined-chamfer-sm` 6px): the cut corner shared by modules, unit bays, strategy cards and the condensed rack. Cut, never rounded. **Painted, not clipped** — see the Cheap Corner Rule below.
- **Rail** (`--rail-bg`, `--rail-hatch`, `--rail-border`): a recessed strip along a plate's top edge. Carries a section name where one is needed, a fine diagonal hatch, and graduation ticks. Texture lives here — on chrome, never behind a value.
- **Socket** (`--socket-bg`, `--socket-border`, `--socket-inset`, `--socket-tick`): empty capacity, pressed in, with walls and a registration tick.
- **Trough** (`--trough-bg`, `--trough-inset`): a recessed channel seating a numeric readout. The bottom highlight is what sells the recess; without it a dark band just reads as a different fill.
- **Lit bay** (`--bay-lit-tint`, `--bay-lit-edge`, `--bay-lit-light`): an upgraded or active bay lit from within — tint plus a brighter top light, no outer halo.

### Shadow Vocabulary

- **Modal lift** (`box-shadow: 0 24px 64px rgba(0,0,0,0.6), 0 6px 20px rgba(0,0,0,0.45)`): Modal content. The deepest lift in the system.
- **Drawer lift** (`box-shadow: -16px 0 48px rgba(0,0,0,0.55)`): Side drawers, cast inward from the edge.
- **Dropdown lift** (`box-shadow: 0 10px 40px rgba(0,0,0,0.5)`): Header menus and dropdowns.
- **Tooltip lift** (`box-shadow: 0 8px 24px rgba(0,0,0,0.5)`): Tooltips and hover cards.
- **Control lift** (`box-shadow: 0 2px 8px rgba(0,0,0,0.3)`, hover `0 4px 12px rgba(0,0,0,0.4)`): Small floating controls such as panel toggles.
- **State glow** (`0 0 8px` / `0 0 4px` of a signal color at 35–60%): Active-player indicator, at-threshold badges. **Never applied to a surface.**
- **Inset top light** (`inset 0 1px 0 rgba(255,255,255,0.08)`): A single hairline of top light that gives tabs and badges material edge.

## 5. Components

**Component philosophy: machined and deliberate.** Every edge should feel cut rather than drawn — squared tabs, bracket corners, hairline seams, sharp alignment. Precision is the dominant tactile quality; hover is a small material shift, never a lift-and-bounce.

### Module (`shared/ui/primitives/Module`)

The player area's unit of organization, and the primitive to reach for when grouping anything. Two nested clipped layers: the outer one is the hairline frame, the inner one the field inset by 1px — a CSS border cannot follow a chamfered corner, so the frame has to be a layer. Strategy cards use the same construction, deliberately.

- **Shape:** chamfered `bottomRight` (default), `topRight`, or `none`
- **Rail:** optional. Carries a label, trailing `meta`, and graduation ticks. **Not** used in the pannable player band — the compartments sit in a fixed left-to-right order, so position identifies them and labels are redundant noise.
- **Brackets:** optional reticle corners on the leading edge. Reserve for a card's primary compartment.
- **`fill`:** stretches to the row height via `align-self`, never `height: 100%` on the root — a percentage height against an auto-height flex container collapses back to content height and defeats the stretch.
- **`accentRgb`:** keys the frame and rail to a signal or player color. The tint stays on the frame; the field never colors.

### Unit bay (`UnitCard`)

A slot in a reinforcement rack: a milled pocket holding the sprite over a soft vignette, with the count seated in a recessed trough along the bottom edge. Upgraded units become a **lit bay** — tint plus brighter top light, no halo. A unit unavailable to the faction becomes a **socket**, the same language as an unresearched tech.

Hover brightens the frame and raises the top light; nothing moves. A twelve-cell rack that lifts on hover is noise, not feedback.

The condensed rack (`denseGrid`) shares the language at smaller scale, with 1px gaps letting the container background through so the cells share one continuous frame instead of each carrying a border.

### HUD decks

The board is **set into a console**: chrome above it, chrome below, the board itself keeping its black field as the one surface allowed to be visually loud. It is the subject, sandwiched between two pieces of HUD.

- **The separation is an edge, not an ornament.** Each deck closes with a lit lip (`--hud-edge-light`), an accent hairline facing the board (`--hud-edge-accent`), and shadow cast toward it. Two attempts at a machined graduation band — segment ticks, then a major/minor graduated bezel — both read as a **measuring rule** rather than instrument plating. A clean edge beats badly-faked ornament, so the band was removed. Real painted-metal bezel ornamentation needs raster artwork; the spec for it is a follow-up, not something to approximate in gradients.
- **Chrome is brushed, not hatched.** `--rail-sheen` is a vertical light-to-dark sweep, which is what a bezel does under an overhead source. It replaced a diagonal crosshatch that read as fabric texture.
- **The bottom deck has its own ground.** `--hud-deck-ground` is per-theme and sits a step *darker* than `--player-card-box-bg`, so the player cards read as plates raised onto the deck and the board stays the brightest thing between them. The deck's sheen is a fixed 120px band at its lip, never a full-height gradient — the deck can run several thousand pixels tall, and a stretched gradient would brighten its far end.
- **One indent for the whole bottom deck.** Every section inside it — round line, score track, objectives, laws, player areas, score breakdown — shares one left margin. Two of those sections previously wrapped themselves in their own bordered panel with inner padding, which put their headings further in than their neighbours and made the deck read as a pile of unrelated blocks.
- **The board gets clearance.** 20px between the lowest tiles and the deck's lip, so hexes never appear to tuck under the chrome.

### Delight moments

This is a product surface, so delight lives at **moments**, never spread across pages, and every moment has to carry information a player wants. Three exist:

- **Relic-ready salvage.** Three fragments of a kind buy a relic, so a stack seats itself in a relic-gold cradle with a stamped count the moment it reaches three. Nothing at one or two. The pleasure is that the interface already knows the rule the player knows.
- **Final approach.** A player one point below the target is the most consequential state in a game of Twilight Imperium, and the victory track used to mark only the finish line. The penultimate square lights as a threat — **when, and only when, it is occupied**. An always-on marker would be decoration; one that appears exactly when the table should be nervous is information.
- **A console signpost.** This audience reads source, so the easter egg is a useful pointer to where the board and player areas render, not a joke or a recruiting pitch.

None of the three animates, and none is a glow for its own sake. A moment that fires on every visit stops being a moment.

### Player identity

A player's card is keyed by a short color band notched into the top edge, not a colored border. Eight stacked cards with colored outlines turn the column into a stack of highlighter marks; the band identifies just as fast and lets the card keep the neutral chrome everything else uses.

### Surface (signature component)

The system's defining primitive. A translucent panel over the map, framed by four **reticle corner brackets** — 20×20px L-shaped fragments inset 8px from each corner, drawn with a 2px accent border and a single 4px rounded outer corner. An optional pattern overlay (20px grid, or repeating radial circles) sits at 3% alpha and 0.5 opacity. An optional uppercase watermark label sits bottom-right at `xs` weight 700.

- **Shape:** Gently curved (`--mantine-radius-md`)
- **Background:** `--surface-bg` (135deg Deep Space Surface → Deep Space Raised, 94–97% alpha)
- **Border:** 1px Hull Slate at 28%
- **Shadow:** None by default (`--surface-shadow` is theme-opt-in)

The brackets are the one ornament the system permits, because they frame data rather than decorate it. Under `vaporwavetheme` they gain an animated inset bloom — that is a theme identity layer, not the default.

### Data panels

- **Corner Style:** 3px (`--panel-radius`); softer themes may round more
- **Background:** `--panel-field` (180deg vertical gradient, 92–96% alpha) for containers; `--panel-field-flat` / `-strip` / `-soft` (42–62% flat fills) for sealed cards, grid strips and name plates
- **Hairlines:** `--panel-separator` (10%), `--panel-hairline` (14%), `--panel-hairline-strong` (22%), `--panel-bracket` (14% brighter, corner brackets only)
- **Texture:** `--panel-texture` — `none` by default; themes may paint scanlines or blooms above the field
- **Internal Padding:** 2–12px, densest at the innermost level

### Buttons and floating controls

- **Shape:** 4px on standard buttons; floating panel toggles use a half-capsule (`0 50% 50% 0`) so the affordance points at the panel it opens
- **Size:** 36×36px for icon-only controls
- **Default:** 135deg Deep Space Raised gradient, 1px `--mantine-color-dark-4` border, `backdrop-filter: blur(4px)`, control-lift shadow
- **Hover:** Gradient opacity rises to full, `scale(1.05)`, shadow deepens to `0 4px 12px`, icon steps from `gray-3` to `gray-1`
- **Focus:** Must be a visible ring, not a color-only shift

### Chips and badges

- **Style:** `.gradient-{color}` utility supplies background (4–10% alpha), border (16–30%) and shadow from one signal color; text in `label` or `data` typography
- **State:** At-threshold badges add a `0 0 8px` state glow at 35%; below threshold stay flat
- **Shape:** 2–4px, or `999px` for count pills

### Navigation

- **Faction tab bar:** Sticky, 8px 12px padding, 44×36px tabs butted edge-to-edge with `border-left: none` on siblings so the row reads as one machined strip; only the first and last tabs round (6px on the outer corners).
- **States:** Default `--faction-tab-bg`; `active` swaps background and shadow; `pinned` takes a blue-to-navy 135deg gradient and a stronger lift. An active-player dot (6px, Signal Green, 2s pulse) sits at the top-right of the tab.
- **Header tabs:** 4px radius, Deep Space at 55% with a Tactical Blue 40% border; hover and active fill with Tactical Blue Deep at 38–40%.
- **Transitions:** `0.2s` on tabs, `0.3s` on floating controls.

### Overlays (modal / drawer / tooltip)

Wired globally through the Mantine theme's `components` config in `main.tsx`, so every floating surface inherits the active theme's details-card chrome from `overlays.css`. Modals: 8px radius, `--details-card-bg`, modal-lift shadow, backdrop at 60% opacity with 3px blur. Titles: 14px / 600 / 0.09em uppercase in the heading family with a 1px dark text-shadow. Tooltips: 4px radius, 5px 10px padding, 12px text.

Never restyle a modal locally. Extend `overlays.css` so all seven themes follow.

### Inputs

- **Style:** Deep Space at 86%, 1px Tactical Blue at 45%, 4px radius
- **Focus:** Border steps toward full Tactical Blue; a visible ring is required
- **Placeholder:** Must meet 4.5:1 — the muted-gray default does not qualify

### Motion

Default transition is **0.2s** (dominant across the system), with 0.12s for immediate feedback and 0.3s for larger chrome movements. Prefer `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) or `cubic-bezier(0.4, 0, 0.2, 1)` for state changes. No bounce, no elastic, no orchestrated page-load sequence between a player and their board. Continuous animation is permitted only where it reports an ongoing condition — the active-player pulse (2s) and theme ambience.

**The Reduced Motion Rule.** Every `@keyframes` needs a `@media (prefers-reduced-motion: reduce)` alternative — a crossfade or an instant state. This is currently satisfied in about 12 files and missing from several that define keyframes; treat closing that gap as part of any change touching animation.

## 6. Do's and Don'ts

### Do:
- **Do** define new visual values as semantic tokens in `themeSharedTokens.css` and override them per theme. A hardcoded color in a component breaks six of the seven themes.
- **Do** use the Hull Slate alpha ladder (10 / 14 / 22 / 28 / 35%) for every hairline, frame and separator.
- **Do** set every comparable numeral in mono (`Space Mono` or `--mantine-font-family-monospace`).
- **Do** give plates a one-pixel bevel and a cut corner, and reserve drop shadow for modals, drawers, dropdowns, tooltips and floating controls.
- **Do** keep the ground → field → socket depth order intact: the card is lighter than the modules inside it, which are lighter than their troughs.
- **Do** group with `Module` rather than inventing another container. It owns the frame, chamfer, bevel and optional rail.
- **Do** draw empty capacity as a recessed socket with walls and a registration tick.
- **Do** use `var(--z-*)` from `zIndexVariables.css` for any stacking above local sibling ordering. The scale is semantic and grouped (map 0–999, map overlays 1000–1999, map UI 2000–2999, modals 3000–3999, tooltips 4000–4999).
- **Do** keep product type on the fixed px scale (9 / 10 / 11 / 12 / 13 / 14 / 18px).
- **Do** style overlays by extending `overlays.css`, so every theme inherits the change.
- **Do** ship all seven states on interactive components: default, hover, focus, active, disabled, loading, error.
- **Do** pair color-coded status with an icon, shape or label, so faction and signal colors are never the only carrier of meaning.
- **Do** give every `@keyframes` a `prefers-reduced-motion` alternative.

### Don't:
- **Don't** build anything that reads as a **generic SaaS dashboard** — rounded cards on light gray, hero stat tiles with a big number and a small label, an indigo accent. PRODUCT.md names this first for a reason.
- **Don't** reach for the **neon cyberpunk cliché**: gradient text, glow on resting surfaces, glass panels used decoratively. `background-clip: text` on a gradient is banned outright; it currently appears in `LandingPage.css:200` and `UnitBadge.module.css:34,40` and should be replaced with a solid color, with emphasis carried by weight or size.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe. One documented exception: the secret-objective dossier's 6px diagonal **hazard stripe**, which is a classified-file motif carrying meaning, not a decorative accent bar. Everything else in this list is the reflex, and it is the system's most widespread violation — `GameStatePanel.module.css:7`, `LawCard.module.css:7`, `ExpandedObjectiveCard.module.css:7`, `PlayerScoreSummary.module.css:64`, `SecretModal.module.css:41,46,51`, `DashboardPage.css:86`, `DashboardPage.module.css:274`, and the `.gradient-left-border` utility in `gradients.css:31`. Replace with a full hairline border, a background tint from the `.gradient-{color}` utility, or a leading icon.
- **Don't** write raw z-index values above local sibling ordering (0–10). Six outliers need migrating to the scale: `z-index: 10000` in `MapUnitTransitionLayer.module.css:75`, `2000` in `PlayerScoreSummary.module.css:47`, `1000` in `ScrollMap.css:22`, `995` in `CommodityIndicator.module.css:4`, `100` in `SecretHand.module.css:61`, `99` in `ProductionIndicator.module.css:5`.
- **Don't** use `gray-7` (`#495057`) or darker for text on Deep Space. It measures 2.47:1.
- **Don't** let Slider fall back to a serif. `font-family: Slider, "Times New Roman", serif` appears in six places; the fallback should be a sans or system stack, or the display face degrades into something the system never intended.
- **Don't** use `clamp()` for product typography. Fixed px only outside the landing hero.
- **Don't** animate a panel's entrance. Motion reports that state changed; it does not announce that a panel exists.
- **Don't** nest cards. A module inside a module inside a card is the **cluttered fan-wiki** failure — dense but undesigned. Subdivide one plate with hairlines and troughs instead of stacking frames.
- **Don't** draw empty slots as dashed outlines. Dashed reads as unfinished layout; empty capacity is a socket.
- **Don't** put a colored border around a player's card, and don't let a status overlay cover a value a player scans for — the old exhausted-strategy-card cross sat on top of the initiative number.
- **Don't** leave a theme inheriting the shared navy chrome when its identity is hueless. `midnightgraytheme` is the default theme and overrides the whole machined-chrome block to zero chroma; any new theme owes the same.
- **Don't** redefine a signal color in a theme file. Themes own surfaces, borders, shadows and texture. Nothing else.
- **Don't** reach for a modal first. In a surface this dense, inline disclosure and side panels almost always beat interrupting the board.
