// ============================================
// Apollo SDK - Microfrontend SDK for Remote Modules
// ============================================

// Framework-agnostic client
export { hubClient, initSdk, isRunningInHub } from './client';

// UI Components (can be used in any framework)
export * from './components/components';
export { ShellLayout, type ShellLayoutProps } from './components/ShellLayout';
export { ErrorBoundary, type ErrorBoundaryProps } from './components/ErrorBoundary';
export { ErrorDialog, type ErrorDialogProps } from './components/ErrorDialog';

// Vanilla React integration (default)
// For Next.js, import from '@apollo/sdk/nextjs'
export {
  ApolloProvider,
  ApolloContext,
  type ApolloContextValue,
} from './react/Provider';

export {
  useReactNavigationHijack,
  type ReactNavigationResult,
} from './react/NavigationHijacker';

export {
  useApollo,
  useApolloUser,
  useBreadcrumbs,
  useSidebarState,
  useApolloNavigation,
} from './react/hooks';
