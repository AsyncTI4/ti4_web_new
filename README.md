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
