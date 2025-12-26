// Core client
export { hubClient, initSdk, isRunningInHub } from './client';

// Components
export { Sidebar, Header, Footer, ShellLayout, ErrorBoundary } from './components';

// React integration
export {
  ApolloProvider,
  ApolloContext,
  useNavigationHijack,
  useApollo,
  useApolloUser,
  useSidebarState,
  useBreadcrumbs,
  useApolloNavigation,
  type ApolloContextValue,
  type NavigationHijackOptions,
} from './react';

// Next.js integration (re-export with Next prefix to avoid confusion)
export {
  NextApolloProvider,
  NextApolloContext,
  useNextNavigationHijack,
  useApollo as useNextApollo,
  useApolloUser as useNextApolloUser,
  useSidebarState as useNextSidebarState,
  useBreadcrumbs as useNextBreadcrumbs,
  useApolloNavigation as useNextApolloNavigation,
  type NextApolloContextValue,
  type NextNavigationHijackOptions,
  type NextNavigationResult,
} from './nextjs';

// Re-export types from shared
export type {
  User,
  BreadcrumbItem,
  SidebarState,
  NavLevel1,
  NavLevel2,
  NavLevel3,
  ModuleConfig,
  MessageRegistry,
  MessageType,
  MessagePayload,
  ErrorCode,
} from '@apollo/shared';
