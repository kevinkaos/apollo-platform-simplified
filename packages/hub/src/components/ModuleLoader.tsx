'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, SidebarState } from '@apollo/shared';
import { buildModuleUrl, getModuleByPath, getExpandedSectionsForPath } from '@apollo/shared';
import { ShellLayout } from './ShellLayout';
import { SkeletonShell } from './Skeleton';
import { IframeContainer } from './IframeContainer';
import { initHubMessaging } from '../lib/hubMessaging';
import {
  getSidebarState,
  setSidebarState,
  setCollapsed,
  toggleSection,
} from '../lib/sidebarState';

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
  const handleNavigate = useCallback((path: string) => {
    router.push(path);
  }, [router]);

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
  const handleError = useCallback((code: 403 | 404 | 500) => {
    router.push(`/${code}`);
  }, [router]);

  // Initialize messaging
  useEffect(() => {
    const cleanup = initHubMessaging({
      onNavigate: handleNavigate,
      onReady: handleReady,
      onLogout,
      onError: handleError,
      getUser: () => user,
    });

    return cleanup;
  }, [handleNavigate, handleReady, onLogout, handleError, user]);

  // Handle path changes - load appropriate module
  useEffect(() => {
    const moduleUrl = buildModuleUrl(pathname);

    if (!moduleUrl) {
      // No module for this path - shouldn't happen in catchall
      router.push('/404');
      return;
    }

    // Start loading and track skeleton start time
    setLoading(true);
    skeletonStartTimeRef.current = Date.now();
    setIframeSrc(moduleUrl);

    // Auto-expand sidebar sections for current path
    const expanded = getExpandedSectionsForPath(pathname);
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
      router.push('/500');
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

  return (
    <ShellLayout
      currentPath={pathname}
      sidebarState={sidebarState}
      onNavigate={handleNavigate}
      onToggleCollapse={handleToggleCollapse}
      onToggleSection={handleToggleSection}
    >
      {/* Skeleton (visible during loading) */}
      {loading && <SkeletonShell />}

      {/* Iframe (hidden until ready) */}
      {iframeSrc && (
        <IframeContainer
          src={iframeSrc}
          visible={!loading}
          onIframeRef={(ref) => { iframeRef.current = ref; }}
        />
      )}
    </ShellLayout>
  );
}
