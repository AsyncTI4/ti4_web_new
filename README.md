# TI4 Web - React + Vite + TypeScript

This is a Twilight Imperium 4 web application built with React, Vite, and TypeScript.

The map supports Fracture positions `frac1` through `frac25`. The original seven
positions reserve 400 pixels of vertical space; any expanded position (`frac8`–`frac25`)
adds another 600 pixels, matching the bot layout for tiles and player-stat areas.
Expanded Fracture systems (`ef1`–`ef12`) and their planets are included through
`src/entities/data/catalogs.ts`, supplementing the generated base catalogs.

Unknown bot map positions are omitted from drawing and listed in a “Map incomplete”
warning. Their raw tile data and planet lookups are retained; other game views
remain usable. Add verified coordinates in `src/entities/data/tileCoordinates.ts`
to render those positions. This also applies to player-stat positions and map previews.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and development server
- **TypeScript** - Type safety and better developer experience
- **Mantine** - UI component library
- **ESLint** - Code linting with TypeScript support

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## Repository Structure

Leader portraits, including the music video, use `getLeaderPortraitUrl()` to map
leader IDs to existing CDN images. Source paths and filename casing are recorded
in `src/entities/data/leaderPortraits.ts` from the bot's `emojis/leaders/` PNGs
and `emojis/Reupload/KeleresCommander.png`. The bot's upload workflow converts
these PNGs to WebP; `cdnImage()` selects that generated format.

The `naaluagent-te` and `xxchahero-te` aliases use the same portraits as their base
IDs, matching the bot's emoji aliases. Their previous frontend WebP files were
byte-identical to the base portraits. Unknown or unavailable portraits retain the
transparent fallback. No duplicate image assets are needed in either repository.

Portrait visibility and leader definitions are managed separately from these assets.
The supplemental `src/entities/data/theodisiLeaders.ts` catalog is generated from
the bot's `src/main/resources/data/leaders/theodisi_leaders.json`; it fills missing
IDs through `catalogs.ts` without replacing definitions in the base catalog.

Default faction icons for `franken19` through `franken26` use the existing CDN
images generated from `emojis/factions/franken/Franken19.png` through `Franken26.png`.
Custom emoji and Discord image overrides still take precedence.

The frontend carries no local copies of these images and requires no new bot image
publication for this migration.

Dependencies point downward: `pages` → `layout` → `domains` → `shared`/`hooks` → `state` → `api` → `entities` → `utils`. `game-shell` composes the other domains; `cards` sits below them.

```
ti4_web_new/
├── public/                    # Static assets
│   ├── cardback/             # Card background images
│   ├── font/                 # Custom fonts
│   ├── planet_attributes/    # Planet trait icons
│   └── ...                   # Game assets (tokens, icons, etc.)
├── src/
│   ├── main.tsx             # Entry point and routes
│   ├── config.ts            # Environment config
│   ├── pages/               # Route-level pages (landing, games, dashboard, game map, image map)
│   ├── layout/              # Site chrome shared by pages (PageShell, SiteHeader, GamesBar)
│   ├── domains/             # Feature areas
│   │   ├── game-shell/      # In-game shell: layouts, sidebars, panels, event log
│   │   ├── map/             # Board rendering: tiles, layers, unit stacks, tooltips
│   │   ├── player/          # Player area cards and composition
│   │   ├── cards/           # Details cards, card backs and deck modals for every card type
│   │   ├── objectives/      # Scoring, public objectives, laws in play
│   │   ├── tabs/            # Game tab bar and tab management
│   │   ├── dashboard/ auth/ settings/ image-map/
│   ├── shared/ui/           # Reusable, domain-agnostic UI
│   ├── hooks/               # Generic hooks
│   ├── state/               # App settings store and game context provider
│   ├── api/                 # Fetching, sockets and auth session
│   ├── entities/            # Pure game model
│   │   ├── data/            # Static game data
│   │   ├── lookup/          # Map-backed getters over the data
│   │   ├── game/            # GameData types and buildGameContext
│   │   ├── geometry/        # Hex and tile geometry
│   │   ├── positioning/     # Unit placement on tiles
│   │   └── replay/          # Map replay planning
│   ├── styles/              # Global styles, themes, z-index variables
│   └── utils/               # Generic helpers
├── build/                   # Production build output
├── dist/                    # Vite build output
├── CLAUDE.md               # AI assistant coding guidelines
├── eslint.config.js        # ESLint configuration
├── postcss.config.cjs      # PostCSS configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.app.json       # App-specific TypeScript config
├── tsconfig.node.json      # Node-specific TypeScript config
├── vite.config.ts          # Vite configuration
└── package.json            # Dependencies and scripts
```

## TypeScript Configuration

The project uses two TypeScript configurations:

- `tsconfig.json` - Main configuration for source code
- `tsconfig.node.json` - Configuration for build tools (Vite config, etc.)

### Key TypeScript Features Enabled

- Strict type checking
- Path mapping with `@/*` alias for `src/*`
- React JSX support
- JSON module resolution
- Unused variable detection

### Adding Types

- Game model types live in `src/entities/game/types.ts`; static data types in `src/entities/data/types.ts`
- Component-specific types should be defined in the same file or nearby
- Third-party library types are automatically included when available

## ESLint Configuration

ESLint is configured to work with both JavaScript and TypeScript files:

- JavaScript/JSX files: Standard React rules
- TypeScript/TSX files: Additional TypeScript-specific rules
- Automatic unused variable detection
- React hooks rules enforcement
