import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { initSdk, hubClient, isRunningInHub } from '../client';
import { ShellLayout } from '../components/ShellLayout';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useReactNavigationHijack, type ReactNavigationResult } from './NavigationHijacker';
import { sidebarNav, getDefaultExpandedSections } from '@apollo/shared';
import type { User, SidebarState, BreadcrumbItem } from '@apollo/shared';

// ============================================
// Context
// ============================================

export interface ApolloContextValue {
  user: User | null;
  isInHub: boolean;
  sidebarState: SidebarState;
  breadcrumbs: BreadcrumbItem[];
  navigation: ReactNavigationResult;
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
  toggleSidebarCollapse: () => void;
  toggleSidebarSection: (sectionId: string) => void;
  logout: () => void;
}

export const ApolloContext = createContext<ApolloContextValue | null>(null);

// ============================================
// Provider Props
// ============================================

interface ApolloProviderProps {
  moduleId: string;
  children: ReactNode;
  excludeNavigationPaths?: string[];
}

// ============================================
// Provider Component
// ============================================

export function ApolloProvider({
  moduleId,
  children,
  excludeNavigationPaths = [],
}: ApolloProviderProps) {
  const isInHub = isRunningInHub();

  // State
  const [user, setUser] = useState<User | null>(null);
  const [sidebarState, setSidebarState] = useState<SidebarState>({
    collapsed: false,
    expandedSections: [],
  });
  const [breadcrumbs, setBreadcrumbsState] = useState<BreadcrumbItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Navigation hijacking
  const navigation = useReactNavigationHijack({
    moduleId,
    excludePaths: excludeNavigationPaths,
  });

  // Initialize SDK
  useEffect(() => {
    if (!isInHub) {
      setIsInitialized(true);
      return;
    }

    initSdk(moduleId);

    // Fetch initial data
    Promise.all([hubClient.getUser(), hubClient.getSidebarState()])
      .then(([userData, sidebarData]) => {
        setUser(userData);

        // If no expanded sections, expand based on current path
        if (sidebarData.expandedSections.length === 0) {
          sidebarData.expandedSections = getDefaultExpandedSections(navigation.currentPath);
        }

        setSidebarState(sidebarData);
        setIsInitialized(true);
      })
      .catch((err) => {
        console.error('[Apollo SDK] Init error:', err);
        setIsInitialized(true);
      });
  }, [moduleId, isInHub, navigation.currentPath]);

  // Set breadcrumbs
  const setBreadcrumbs = useCallback(
    (items: BreadcrumbItem[]) => {
      setBreadcrumbsState(items);
      if (isInHub) {
        hubClient.setBreadcrumbs(items);
      }
    },
    [isInHub]
  );

  // Toggle sidebar collapse
  const toggleSidebarCollapse = useCallback(() => {
    setSidebarState((prev: SidebarState) => {
      const newState = { ...prev, collapsed: !prev.collapsed };
      if (isInHub) {
        hubClient.setSidebarState(newState);
      }
      return newState;
    });
  }, [isInHub]);

  // Toggle sidebar section
  const toggleSidebarSection = useCallback(
    (sectionId: string) => {
      setSidebarState((prev: SidebarState) => {
        const isExpanded = prev.expandedSections.includes(sectionId);
        const newState = {
          ...prev,
          expandedSections: isExpanded
            ? prev.expandedSections.filter((id: string) => id !== sectionId)
            : [...prev.expandedSections, sectionId],
        };
        if (isInHub) {
          hubClient.setSidebarState(newState);
        }
        return newState;
      });
    },
    [isInHub]
  );

  // Logout
  const logout = useCallback(() => {
    if (isInHub) {
      hubClient.logout();
    }
  }, [isInHub]);

  // Context value
  const contextValue: ApolloContextValue = {
    user,
    isInHub,
    sidebarState,
    breadcrumbs,
    navigation,
    setBreadcrumbs,
    toggleSidebarCollapse,
    toggleSidebarSection,
    logout,
  };

  // Standalone mode - render children without shell
  if (!isInHub) {
    return <ApolloContext.Provider value={contextValue}>{children}</ApolloContext.Provider>;
  }

  // Don't render until initialized
  if (!isInitialized) {
    return null;
  }

  // Hub mode - render with shell
  return (
    <ApolloContext.Provider value={contextValue}>
      <ErrorBoundary>
        <ShellLayout
          nav={sidebarNav}
          currentPath={navigation.currentPath}
          sidebarState={sidebarState}
          user={user}
          breadcrumbs={breadcrumbs}
          onNavigate={navigation.push}
          onToggleSidebarCollapse={toggleSidebarCollapse}
          onToggleSidebarSection={toggleSidebarSection}
          onLogout={logout}
        >
          {children}
        </ShellLayout>
      </ErrorBoundary>
    </ApolloContext.Provider>
  );
}
