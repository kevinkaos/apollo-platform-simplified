// Next.js integration for Apollo SDK
// Import from '@apollo/sdk/nextjs'

export { NextApolloProvider, NextApolloContext } from './Provider';
export type { NextApolloContextValue } from './Provider';
export { useNextNavigationHijack } from './NavigationHijacker';
export type { NextNavigationResult } from './NavigationHijacker';
export {
  useApollo,
  useApolloUser,
  useBreadcrumbs,
  useSidebarState,
  useApolloNavigation,
} from './hooks';
