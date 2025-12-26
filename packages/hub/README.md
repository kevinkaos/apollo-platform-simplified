# @apollo/hub

Next.js 14 microfrontend container that serves as the shell application for the Apollo Platform.

## Overview

The hub provides the main application shell (sidebar, header, footer, breadcrumbs) and loads remote modules via iframes. It handles authentication, navigation, and cross-iframe messaging using post-robot.

## Structure

```
src/
├── app/                      # Next.js app router
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Root redirect
│   ├── login/page.tsx        # Authentication page
│   ├── [...slug]/page.tsx    # Catch-all for module routes
│   ├── 403/page.tsx          # Forbidden error
│   ├── 404/page.tsx          # Not found error
│   └── 500/page.tsx          # Server error
├── components/
│   ├── ModuleLoader.tsx      # Core iframe orchestration
│   ├── IframeContainer.tsx   # Sandboxed iframe wrapper
│   └── Skeleton.tsx          # Loading states
├── hooks/
│   └── useSidebarState.ts    # Sidebar state management
├── messaging/
│   └── hubMessaging.ts       # post-robot message handlers
├── middleware.ts             # Auth protection
└── styles/
    └── globals.css
```

## Key Components

| Component         | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| `ModuleLoader`    | Loads iframes, manages loading state, handles messaging |
| `IframeContainer` | Renders sandboxed iframes with security attributes      |
| `ShellLayout`     | Main layout with sidebar, header, and footer (from SDK) |

## Features

- **Module Loading**: Dynamically loads remote modules based on URL path
- **Authentication**: Middleware-based auth with cookie validation
- **3-Level Navigation**: Hierarchical sidebar with collapsible sections
- **Cross-Iframe Messaging**: Bidirectional communication via post-robot
- **Loading States**: Skeleton screens during transitions
- **Error Handling**: Dedicated 403, 404, 500 error pages

## Message Protocol

### Incoming (from modules)

| Message           | Description                |
| ----------------- | -------------------------- |
| `READY`           | Module finished loading    |
| `NAVIGATE`        | Module requests navigation |
| `SET_BREADCRUMBS` | Update breadcrumb trail    |
| `SET_LOADING`     | Toggle loading state       |
| `GET_USER`        | Request user data          |
| `LOGOUT`          | Request logout             |
| `ERROR`           | Report 403/404/500 error   |

### Outgoing (to modules)

| Message         | Description                     |
| --------------- | ------------------------------- |
| `ROUTE_CHANGE`  | Browser back/forward navigation |
| `USER_DATA`     | Response to GET_USER            |
| `SIDEBAR_STATE` | Response to GET_SIDEBAR_STATE   |

## Configuration

### Environment Variables

```bash
NEXT_PUBLIC_EMPLOYEES_URL=http://localhost:3001
NEXT_PUBLIC_PAYROLL_URL=http://localhost:3002
NEXT_PUBLIC_BENEFITS_URL=http://localhost:3003
```

### Content Security Policy

The hub configures CSP headers in `next.config.js` to allow iframes from configured module origins.

## Development

```bash
# Run in development mode
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Dependencies

- Next.js 14
- React 18
- post-robot (cross-iframe messaging)
- @apollo/sdk (shell components)
- @apollo/shared (types and config)
