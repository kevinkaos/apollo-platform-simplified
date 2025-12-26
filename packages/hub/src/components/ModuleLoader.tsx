'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { User, SidebarState, BreadcrumbItem } from '@apollo/shared';
import {
  resolveModuleUrl,
  getModuleByPath,
  getDefaultExpandedSections,
  sidebarNav,
} from '@apollo/shared';
import { ShellLayout } from '@apollo/sdk';
import { SkeletonShell } from './Skeleton';
import { IframeContainer } from './IframeContainer';
import { initHubMessaging, sendRouteChangeToModule } from '../messaging/hubMessaging';
import {
  getSidebarState,
  setSidebarState,
  setCollapsed,
  toggleSection,
} from '../hooks/sidebarState';

const READY_TIMEOUT = 5000; // 5 seconds
const MIN_SKELETON_TIME = 300; // 300ms minimum skeleton display to prevent flash

interface ModuleLoaderProps {
  user: User | null;
  onLogout: () => void;
}

export function ModuleLoader({ user, onLogout }: ModuleLoaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // State
  const [loading, setLoading] = useState(true);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [sidebarState, setSidebarStateLocal] = useState<SidebarState>(getSidebarState);

  // Refs
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const skeletonStartTimeRef = useRef<number>(Date.now());

  // Navigate handler (from sidebar clicks or SDK messages)
  const handleNavigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  // Ready handler (SDK signals module loaded)
  const handleReady = useCallback((moduleId: string) => {
    console.log(`[Hub] Module ready: ${moduleId}`);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Enforce minimum skeleton display time to prevent flash
    const elapsed = Date.now() - skeletonStartTimeRef.current;
    if (elapsed < MIN_SKELETON_TIME) {
      setTimeout(() => {
        setLoading(false);
      }, MIN_SKELETON_TIME - elapsed);
    } else {
      setLoading(false);
    }
  }, []);

  // Error handler
  const handleError = useCallback(
    (code: 403 | 404 | 500) => {
      router.push(`/errors/${code}`);
    },
    [router]
  );

  // Initialize messaging
  useEffect(() => {
    const cleanup = initHubMessaging({
      onNavigate: handleNavigate,
      onBreadcrumbsChange: () => {}, // Not used in this component
      onLoadingChange: (loading) => {
        if (!loading) handleReady('module');
      },
      onLogout,
      onError: handleError,
      onSidebarStateChange: (state) => {
        setSidebarState(state);
        setSidebarStateLocal(state);
      },
      getUser: () => user,
      getSidebarState: () => sidebarState,
      getCurrentRoute: () => ({ path: pathname }),
    });

    return cleanup;
  }, [handleNavigate, handleReady, onLogout, handleError, user, sidebarState, pathname]);

  // Handle browser back/forward - notify iframe of route changes
  useEffect(() => {
    const handlePopState = () => {
      const iframe = iframeRef.current;
      if (iframe && !loading) {
        sendRouteChangeToModule(iframe, { path: window.location.pathname });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [loading]);

  // Handle path changes - load appropriate module
  useEffect(() => {
    const moduleUrl = resolveModuleUrl(pathname);

    if (!moduleUrl) {
      // No module for this path - shouldn't happen in catchall
      router.push('/errors/404');
      return;
    }

    // Start loading and track skeleton start time
    setLoading(true);
    skeletonStartTimeRef.current = Date.now();
    setIframeSrc(moduleUrl);

    // Auto-expand sidebar sections for current path
    const expanded = getDefaultExpandedSections(pathname);
    const currentState = getSidebarState();
    if (expanded.length > 0) {
      const newState = {
        ...currentState,
        expandedSections: [...new Set([...currentState.expandedSections, ...expanded])],
      };
      setSidebarState(newState);
      setSidebarStateLocal(newState);
    }

    // Set timeout for READY signal
    timeoutRef.current = setTimeout(() => {
      console.error(`[Hub] Module did not send READY within ${READY_TIMEOUT}ms`);
      router.push('/errors/500');
    }, READY_TIMEOUT);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [pathname, router]);

  // Sidebar handlers
  const handleToggleCollapse = useCallback(() => {
    const newState = { ...sidebarState, collapsed: !sidebarState.collapsed };
    setCollapsed(newState.collapsed);
    setSidebarStateLocal(newState);
  }, [sidebarState]);

  const handleToggleSection = useCallback((sectionId: string) => {
    toggleSection(sectionId);
    setSidebarStateLocal(getSidebarState());
  }, []);

  const currentModule = getModuleByPath(pathname);

  return (
    <ShellLayout
      nav={sidebarNav}
      currentPath={pathname}
      sidebarState={sidebarState}
      user={user}
      breadcrumbs={[]}
      onNavigate={handleNavigate}
      onToggleSidebarCollapse={handleToggleCollapse}
      onToggleSidebarSection={handleToggleSection}
      onLogout={onLogout}
    >
      {/* Skeleton (visible during loading) */}
      {loading && <SkeletonShell />}

      {/* Iframe (hidden until ready) */}
      {iframeSrc && currentModule && (
        <IframeContainer
          ref={iframeRef}
          src={iframeSrc}
          moduleId={currentModule.id}
          visible={!loading}
        />
      )}
    </ShellLayout>
  );
}
