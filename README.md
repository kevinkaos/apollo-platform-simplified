# Apollo Platform

A microfrontend shell that provides consistent UI chrome (sidebar, header, footer, breadcrumbs) across multiple frontend applications embedded via iframes.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Apollo Hub (Next.js)                                       │
│  ┌──────────┐  ┌──────────────────────────────────────────┐ │
│  │ Sidebar  │  │ Header + Breadcrumbs                     │ │
│  │ (3-level │  ├──────────────────────────────────────────┤ │
│  │  nav)    │  │                                          │ │
│  │          │  │  <iframe src="module-url">               │ │
│  │          │  │    Remote Frontend (React/Next.js)       │ │
│  │          │  │    └── Uses @apollo/sdk                  │ │
│  │          │  │                                          │ │
│  │          │  ├──────────────────────────────────────────┤ │
│  │          │  │ Footer                                   │ │
│  └──────────┘  └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm hub:dev

# Build all packages
pnpm build
```

## Project Structure

```
apollo-platform/
├── packages/
│   ├── hub/          # Shell application (Next.js)
│   ├── sdk/          # Client SDK for remote modules
│   └── shared/       # Shared types and configuration
├── pnpm-workspace.yaml
└── package.json
```

## Packages

| Package | Description |
|---------|-------------|
| [@apollo/hub](./packages/hub) | Next.js shell with sidebar, header, footer, and iframe container |
| [@apollo/sdk](./packages/sdk) | SDK for remote modules to communicate with the hub |
| @apollo/shared | Shared types, navigation config, and module utilities |

## Adding a New Module

1. Register the module in `packages/shared/config/modules.ts`:

```typescript
export const modules: ModuleConfig[] = [
  {
    id: 'mymodule',
    name: 'My Module',
    pathPrefix: '/mymodule',
    url: process.env.NEXT_PUBLIC_MYMODULE_URL || 'http://localhost:3005',
  },
];
```

2. Add navigation items in `packages/shared/config/navigation.ts`:

```typescript
export const sidebarNav: NavLevel1[] = [
  {
    id: 'mymodule',
    label: 'My Module',
    icon: 'box',
    children: [
      {
        id: 'section1',
        label: 'Section 1',
        children: [
          { id: 'page1', label: 'Page 1', path: '/mymodule/page1' },
        ],
      },
    ],
  },
];
```

3. Configure the module URL via environment variable:

```bash
NEXT_PUBLIC_MYMODULE_URL=http://localhost:3005
```

## Development

```bash
# Run hub in dev mode
pnpm hub:dev

# Build SDK
pnpm sdk:build

# Build all packages
pnpm build

# Type check all packages
pnpm -r typecheck
```

## Prerequisites

- Node.js 18+
- pnpm 9.15+

## License

MIT
