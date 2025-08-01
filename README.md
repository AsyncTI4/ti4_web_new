# TI4 Web - React + Vite + TypeScript

This is a Twilight Imperium 4 web application built with React, Vite, and TypeScript.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and development server
- **TypeScript** - Type safety and better developer experience
- **Mantine** - UI component library
- **ESLint** - Code linting with TypeScript support

## Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Type checking
yarn type-check

# Build for production
yarn build

# Preview production build
yarn preview
```

## Repository Structure

```
ti4_web_new/
├── public/                    # Static assets
│   ├── cardback/             # Card background images
│   ├── font/                 # Custom fonts
│   ├── leaders/              # Faction leader images
│   ├── planet_attributes/    # Planet trait icons
│   └── ...                   # Game assets (tokens, icons, etc.)
├── src/
│   ├── components/           # React components
│   │   ├── Map/             # Map-related components
│   │   ├── Objectives/      # Objectives and scoring components
│   │   ├── PlayerArea/      # Player-specific UI components
│   │   ├── shared/          # Reusable UI components
│   │   └── ...              # Page-level components
│   ├── context/             # React context providers
│   ├── data/                # Game data and static content
│   ├── hooks/               # Custom React hooks
│   ├── lookup/              # Data lookup utilities
│   ├── mapgen/              # Map generation logic
│   ├── styles/              # Global styles and CSS
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── main.tsx             # Application entry point
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

- Global types can be added to `src/types/global.d.ts`
- Component-specific types should be defined in the same file or nearby
- Third-party library types are automatically included when available

## ESLint Configuration

ESLint is configured to work with both JavaScript and TypeScript files:

- JavaScript/JSX files: Standard React rules
- TypeScript/TSX files: Additional TypeScript-specific rules
- Automatic unused variable detection
- React hooks rules enforcement
