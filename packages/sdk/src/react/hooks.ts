'use client';

import { useContext, useEffect } from 'react';
import { NextApolloContext, type NextApolloContextValue } from './Provider';
import type { BreadcrumbItem } from '@apollo/shared';

/**
 * Access the Apollo context (Next.js)
 */
export function useApollo(): NextApolloContextValue {
  const context = useContext(NextApolloContext);
  if (!context) {
    throw new Error('useApollo must be used within NextApolloProvider');
  }
  return context;
}

/**
 * Get current user
 */
export function useApolloUser() {
  return useApollo().user;
}

/**
 * Get sidebar state and controls
 */
export function useSidebarState() {
  const { sidebarState, toggleSidebarCollapse, toggleSidebarSection } = useApollo();
  return {
    state: sidebarState,
    toggleCollapse: toggleSidebarCollapse,
    toggleSection: toggleSidebarSection,
  };
}

/**
 * Declaratively set breadcrumbs
 */
export function useBreadcrumbs(items: BreadcrumbItem[]): void {
  const { setBreadcrumbs } = useApollo();

  useEffect(() => {
    setBreadcrumbs(items);
  }, [items, setBreadcrumbs]);
}

/**
 * Get navigation functions
 */
export function useApolloNavigation() {
  const { navigation } = useApollo();
  return navigation;
}
