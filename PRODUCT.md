# Product

## Register

product

## Platform

web

## Users

Experienced Twilight Imperium 4 players in the middle of an active asynchronous game. They already know the rules deeply and are not looking to be taught them; they open the app to find out what changed and what the board looks like right now, often in a short window between other things. Because they are fluent, **density beats hand-holding** — more information on screen is a service to them, not a burden, provided it is organized. There is no separate spectator or newcomer audience to design around.

## Product Purpose

AsyncTI4's web UI renders the live state of a play-by-Discord Twilight Imperium game: the map, objectives, laws in play, and every player's assets and score. Success is narrow and testable — a player opens a game and **understands the current board situation at a glance**, without hunting through panels or scrolling back through the Discord log to reconstruct it.

## Positioning

Async Twilight Imperium that feels like a real client. The game is played over days through Discord, but the interface should carry the quality and immediacy of a dedicated digital board game client rather than a static posted image.

## Brand Personality

Precise, tactical, restrained — a command console rather than a dashboard. Quiet chrome, instrument-grade detail, information doing the talking. Cinematic atmosphere is welcome but earns its place through the theme layer: depth, ambience, and per-theme identity carry Twilight Imperium's space-opera scale without competing with the data.

The reference points are **Linear and Raycast** for restrained dark surfaces, keyboard-fast interaction, and chrome that gets out of the way; and **sci-fi game HUDs** for in-fiction console language — bracket corners, scanlines, faction color coding, tactical readouts. The existing token layer already speaks this dialect, and future work should extend it rather than replace it.

## Anti-references

- **Generic SaaS dashboard.** Rounded cards on light gray, stat tiles with big numbers, an indigo accent. Anything that could be any B2B tool.
- **Neon cyberpunk cliché.** Gradient text, glow on everything, glass panels used decoratively. Sci-fi arrived at by reflex instead of by design.
- **Over-animated and floaty.** Entrance animations on every panel; decorative motion that delays reading the board.
- **Cluttered fan-wiki.** Dense but undesigned — mismatched tables, inconsistent spacing, everything at the same visual weight.

The last two are the sharpest constraints here, because density and atmosphere are both goals: this project fails by becoming undisciplined, not by becoming boring.

## Design Principles

1. **The board is the subject.** Chrome recedes so game state reads first. If a panel competes with the map for attention, the panel is wrong.
2. **Density is the feature; discipline is the method.** Fitting more on screen is a win only when typographic and spacing rules make it legible. Never buy density with inconsistency.
3. **In-fiction, not in costume.** Console language — brackets, hairlines, reticles, scanlines — is allowed when it carries or frames information. The moment it becomes decoration, it's the cyberpunk anti-reference.
4. **Motion reports state; it never announces itself.** Transitions exist to show that something changed. No orchestrated page-load choreography between a player and their board.
5. **Theme identity lives in the neutral chrome; game semantics stay fixed.** Stage orange, secret red, relic gold and faction colors mean the same thing in every theme. Themes may only reinterpret surfaces, borders and ambience.

## Accessibility & Inclusion

No formal conformance level has been set for this project yet — treat this section as open rather than as a standard already adopted. What the code does commit to today is worth preserving and extending: keyboard navigation of the map's hex ring (`useHexRingNavigation`), screen-reader descriptions of tiles (`useTileVoiceOver`), and live-region announcements (`useLiveAnnouncer`).

Two known gaps to resolve when the bar is decided: `prefers-reduced-motion` alternatives are present in roughly 12 files but absent from several others that define keyframes, and contrast has not been verified across all seven themes.
