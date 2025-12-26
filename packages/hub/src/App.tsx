import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { IframeContainer } from './components/IframeContainer';
import { initHubMessaging } from './messaging/hubMessaging';
import { sidebarNav, getModuleByPath, getModuleUrl } from './config/modules';
import { BreadcrumbItem, User } from '../shared/types';

export function App() {
  // Navigation state
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);

  // UI state
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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

    const module = getModuleByPath(path);
    if (module) {
      setLoading(true);
      setCurrentModuleId(module.id);
      setIframeSrc(getModuleUrl(module.id, path));
      setBreadcrumbs([{ label: module.name, path: `/${module.id}` }]);
    } else {
      // No module for this path - show empty state or dashboard
      setCurrentModuleId(null);
      setIframeSrc(null);
      setBreadcrumbs([]);
    }
  }, []);

  // Initialize hub messaging
  useEffect(() => {
    const cleanup = initHubMessaging({
      onNavigate: navigate,
      onBreadcrumbsChange: setBreadcrumbs,
      onLoadingChange: setLoading,
      getUser: () => user,
    });

    return cleanup;
  }, [navigate, user]);

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
  }, []);

  return (
    <Layout
      sidebarItems={sidebarNav}
      activePath={currentPath}
      breadcrumbs={breadcrumbs}
      user={user}
      sidebarCollapsed={sidebarCollapsed}
      onNavigate={navigate}
      onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      onLogout={() => console.log('Logout clicked')}
    >
      <IframeContainer
        src={iframeSrc}
        moduleId={currentModuleId}
      />
    </Layout>
  );
}
