# Apollo Platform - Minimal Architecture

A microfrontend shell that provides consistent UI chrome (sidebar, header, footer, breadcrumbs) across multiple frontend applications embedded via iframes.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Apollo Hub                                                 │
│  ┌──────────┐  ┌──────────────────────────────────────────┐ │
│  │ Sidebar  │  │ Header + Breadcrumbs                     │ │
│  │          │  ├──────────────────────────────────────────┤ │
│  │          │  │                                          │ │
│  │          │  │  <iframe src="module-url">               │ │
│  │          │  │    Remote Frontend (React/Next.js)       │ │
│  │          │  │    └── Uses @apollo/sdk                  │ │
│  │          │  │                                          │ │
│  │          │  ├──────────────────────────────────────────┤ │
│  │          │  │ Footer                                   │ │
│  └──────────┘  └──────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Line Count Summary

| Package | Files | Lines | Purpose |
|---------|-------|-------|---------|
| shared/types.ts | 1 | ~60 | Shared type definitions |
| hub/ | 10 | ~450 | Shell application |
| sdk/ | 6 | ~300 | Client SDK for remotes |
| **Total** | **17** | **~810** | |

Compare to your current: **50,000 lines** → **810 lines** (98% reduction)

## Hub Package

### Files

```
packages/hub/src/
├── components/
│   ├── Sidebar.tsx      # 45 lines
│   ├── Header.tsx       # 30 lines
│   ├── Footer.tsx       # 15 lines
│   ├── Breadcrumbs.tsx  # 35 lines
│   ├── Skeleton.tsx     # 40 lines
│   ├── IframeContainer.tsx  # 45 lines
│   └── Layout.tsx       # 55 lines
├── messaging/
│   └── hubMessaging.ts  # 55 lines
├── config/
│   └── modules.ts       # 30 lines
├── App.tsx              # 85 lines
└── styles.css           # 250 lines
```

### Key Concepts

1. **One iframe at a time** - No pooling, no circuit breakers
2. **Direct post-robot usage** - No abstraction layers
3. **Simple state** - React useState, no state machines
4. **Skeleton on transition** - Shows while iframe loads

## SDK Package

### Files

```
packages/sdk/src/
├── client.ts                    # 50 lines - post-robot wrapper
├── react/
│   ├── Provider.tsx             # 60 lines
│   └── NavigationHijacker.ts    # 70 lines
├── nextjs/
│   ├── Provider.tsx             # 65 lines
│   └── NavigationHijacker.ts    # 60 lines
└── index.ts                     # 20 lines
```

## Usage

### In a React Remote Module

```tsx
// app.tsx
import { ApolloProvider, useApollo } from '@apollo/sdk';

function App() {
  return (
    <ApolloProvider moduleId="employees">
      <EmployeeRoutes />
    </ApolloProvider>
  );
}

// Inside any component
function EmployeeList() {
  const { user, setBreadcrumbs } = useApollo();

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Employees', path: '/employees' },
      { label: 'List' }
    ]);
  }, []);

  return <div>Welcome, {user?.name}</div>;
}
```

### In a Next.js Remote Module

```tsx
// app/layout.tsx
import { NextApolloProvider } from '@apollo/sdk';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextApolloProvider moduleId="payroll">
          {children}
        </NextApolloProvider>
      </body>
    </html>
  );
}

// app/reports/page.tsx
'use client';
import { useApollo, useApolloNavigation } from '@apollo/sdk';

export default function ReportsPage() {
  const { setBreadcrumbs } = useApollo();
  const { push } = useApolloNavigation();

  const handleClick = () => {
    push('/reports/new'); // Notifies hub + updates local router
  };

  return <button onClick={handleClick}>New Report</button>;
}
```

## Message Protocol

Hub ↔ SDK communication uses post-robot with these message types:

| Message | Direction | Payload | Purpose |
|---------|-----------|---------|---------|
| `READY` | SDK → Hub | `{ moduleId }` | Module finished loading |
| `NAVIGATE` | SDK → Hub | `{ path }` | Request hub navigation |
| `SET_BREADCRUMBS` | SDK → Hub | `{ items }` | Update breadcrumb trail |
| `SET_LOADING` | SDK → Hub | `{ loading }` | Show/hide skeleton |
| `GET_USER` | SDK → Hub | - | Request current user |

## What's NOT Here (On Purpose)

| Removed | Reason |
|---------|--------|
| `CircuitBreaker` | You have one iframe. It either works or doesn't. |
| `ConnectionPool` | You have one connection. |
| `MessageBridge` | post-robot already handles this. |
| `PostRobotAdapter` | Unnecessary abstraction. |
| `LoggerFactory` | Use console.log or your app's logger. |
| `SingletonManager` | Module-level variables work fine. |
| `EventEmitter` | Built into browsers. |
| `DataCache` | What are you caching? |

## Testing Strategy

For this architecture, you need:

1. **Integration test** - Hub loads iframe, SDK sends READY
2. **Navigation test** - Click link in iframe, hub URL updates
3. **Breadcrumb test** - SDK updates breadcrumbs, hub displays them

That's maybe 100-150 lines of tests. Not 15,000.

```tsx
// Example test
test('SDK notifies hub when ready', async () => {
  const onReady = jest.fn();
  initHubMessaging({ onNavigate: jest.fn(), onLoadingChange: jest.fn(), ... });
  
  // Simulate SDK sending ready
  await postRobot.send(hubWindow, 'READY', { moduleId: 'employees' });
  
  expect(onReady).toHaveBeenCalledWith('employees');
});
```

## Migration Path

1. Create new `apollo-platform-v2` repo with this structure
2. Update one remote module to use new SDK
3. Test in isolation
4. Gradually migrate other modules
5. Deprecate old platform

Don't try to refactor 50k lines. Start fresh.
