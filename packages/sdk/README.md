# @apollo/sdk

SDK for remote modules running inside the Apollo Hub.

## Installation

```bash
pnpm add @apollo/sdk
```

## Quick Start

### React

```tsx
import { ApolloProvider } from '@apollo/sdk';

function App() {
  return (
    <ApolloProvider moduleId="my-module">
      <YourApp />
    </ApolloProvider>
  );
}
```

### Next.js

```tsx
import { NextApolloProvider } from '@apollo/sdk/nextjs';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextApolloProvider moduleId="my-module">
          {children}
        </NextApolloProvider>
      </body>
    </html>
  );
}
```

## Hooks

### `useApollo()`

Access the full Apollo context.

```tsx
const { user, navigation, setBreadcrumbs, sidebarState } = useApollo();
```

### `useApolloUser()`

Get the current authenticated user.

```tsx
const user = useApolloUser();
// { id, name, email, avatar? }
```

### `useApolloNavigation()`

Navigate within the hub.

```tsx
const { push, replace, currentPath } = useApolloNavigation();
push('/dashboard');
```

### `useBreadcrumbs(items)`

Declaratively set breadcrumbs.

```tsx
useBreadcrumbs([
  { label: 'Home', path: '/' },
  { label: 'Settings' },
]);
```

### `useSidebarState()`

Control the sidebar.

```tsx
const { state, toggleCollapse, toggleSection } = useSidebarState();
```

## Hub Client API

For framework-agnostic usage:

```ts
import { hubClient, isRunningInHub } from '@apollo/sdk';

if (isRunningInHub()) {
  await hubClient.navigate('/path');
  await hubClient.setBreadcrumbs([{ label: 'Page' }]);

  const user = await hubClient.getUser();
  await hubClient.setLoading(true);
  await hubClient.reportError(404);
  await hubClient.logout();

  const state = await hubClient.getSidebarState();
  await hubClient.setSidebarState({ collapsed: true, expandedSections: [] });

  hubClient.onRouteChange(({ path }) => {
    console.log('Route changed:', path);
  });
}
```

## Components

### `ShellLayout`

Complete shell with sidebar, header, content area, and footer.

### `ErrorBoundary`

React error boundary that reports errors to the hub.

### `ErrorDialog`

Modal dialog for displaying errors.

## Entry Points

| Import | Use Case |
|--------|----------|
| `@apollo/sdk` | Main SDK, React hooks, components |
| `@apollo/sdk/react` | React-specific exports |
| `@apollo/sdk/nextjs` | Next.js App Router integration |

## Types

```ts
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface SidebarState {
  collapsed: boolean;
  expandedSections: string[];
}
```

## Standalone Mode

The SDK works both inside the hub (iframe) and as a standalone app. Use `isRunningInHub()` to detect the environment:

```tsx
if (isRunningInHub()) {
  // Running inside hub iframe - use SDK features
} else {
  // Standalone mode - provide fallback behavior
}
```

## Development

```bash
pnpm dev    # Watch mode
pnpm build  # Build for production
pnpm test   # Run tests
```
