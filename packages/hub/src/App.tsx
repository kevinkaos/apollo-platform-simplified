import React, { useState, useEffect, useCallback } from 'react';
import { ShellLayout } from '@apollo/sdk';
import { IframeContainer } from './components/IframeContainer';
import { initHubMessaging } from './messaging/hubMessaging';
import { sidebarNav, getModuleByPath, resolveModuleUrl } from '@apollo/shared';
import type { BreadcrumbItem, User, SidebarState } from '@apollo/shared';
import {
  getSidebarState,
  setSidebarState,
  setCollapsed,
  toggleSection,
} from './hooks/sidebarState';

export function App() {
  // Navigation state
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);

  // UI state
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarState, setSidebarStateLocal] = useState<SidebarState>(getSidebarState);

  // User state (would come from auth in real app)
  const [user] = useState<User | null>({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  });

  // Handle navigation (from sidebar clicks or SDK messages)
  const navigate = useCallback((path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);

    const currentModule = getModuleByPath(path);
    if (currentModule) {
      setLoading(true);
      setCurrentModuleId(currentModule.id);
      const moduleUrl = resolveModuleUrl(path);
      setIframeSrc(moduleUrl);
      setBreadcrumbs([{ label: currentModule.name, path: `/${currentModule.id}` }]);
    } else {
      // No module for this path - show empty state or dashboard
      setCurrentModuleId(null);
      setIframeSrc(null);
      setBreadcrumbs([]);
    }
  }, []);

  // Sidebar handlers
  const handleToggleSidebarCollapse = useCallback(() => {
    const newCollapsed = !sidebarState.collapsed;
    setCollapsed(newCollapsed);
    setSidebarStateLocal((prev) => ({ ...prev, collapsed: newCollapsed }));
  }, [sidebarState.collapsed]);

  const handleToggleSidebarSection = useCallback((sectionId: string) => {
    toggleSection(sectionId);
    setSidebarStateLocal(getSidebarState());
  }, []);

  const handleLogout = useCallback(() => {
    console.log('Logout clicked');
  }, []);

  // Initialize hub messaging
  useEffect(() => {
    const cleanup = initHubMessaging({
      onNavigate: navigate,
      onBreadcrumbsChange: setBreadcrumbs,
      onLoadingChange: setLoading,
      onLogout: handleLogout,
      onError: (code) => console.error(`Error: ${code}`),
      onSidebarStateChange: (state) => {
        setSidebarState(state);
        setSidebarStateLocal(state);
      },
      getUser: () => user,
      getSidebarState: () => sidebarState,
      getCurrentRoute: () => ({ path: currentPath }),
    });

    return cleanup;
  }, [navigate, user, handleLogout, sidebarState, currentPath]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      navigate(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate]);

  // Initialize from current URL on mount
  useEffect(() => {
    navigate(window.location.pathname);
  }, [navigate]);

  return (
    <ShellLayout
      nav={sidebarNav}
      currentPath={currentPath}
      sidebarState={sidebarState}
      user={user}
      breadcrumbs={breadcrumbs}
      onNavigate={navigate}
      onToggleSidebarCollapse={handleToggleSidebarCollapse}
      onToggleSidebarSection={handleToggleSidebarSection}
      onLogout={handleLogout}
    >
      {iframeSrc && currentModuleId && (
        <IframeContainer src={iframeSrc} moduleId={currentModuleId} visible={!loading} />
      )}
    </ShellLayout>
  );
}
