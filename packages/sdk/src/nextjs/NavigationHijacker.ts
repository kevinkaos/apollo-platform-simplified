'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { hubClient, isRunningInHub } from '../client';

interface UseNextNavigationHijackOptions {
  moduleId: string;
  excludePaths?: string[];
}

export interface NextNavigationResult {
  push: (path: string) => void;
  replace: (path: string) => void;
}

// Navigation debounce delay in ms
const NAVIGATION_DEBOUNCE_MS = 50;

/**
 * Next.js App Router navigation hijacker
 *
 * Provides bidirectional navigation synchronization between Next.js App Router
 * (running in an iframe module) and the parent hub URL.
 *
 * Features:
 * - Intercepts anchor clicks and notifies hub
 * - Intercepts history.pushState/replaceState for programmatic navigation
 * - Listens for ROUTE_CHANGE from hub (browser back/forward)
 * - Debounces rapid navigation to prevent message spam
 * - Prevents infinite navigation loops with sync flag
 */
export function useNextNavigationHijack({
  moduleId,
  excludePaths = [],
}: UseNextNavigationHijackOptions) {
  const router = useRouter();
  const pathname = usePathname();

  // Refs for cleanup and loop prevention
  const isSyncingFromHubRef = useRef(false);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const originalPushStateRef = useRef<typeof history.pushState | null>(null);
  const originalReplaceStateRef = useRef<typeof history.replaceState | null>(null);
  const unsubscribeRouteChangeRef = useRef<(() => void) | null>(null);

  // Notify hub of navigation (debounced)
  const notifyHubDebounced = useCallback(
    (path: string) => {
      // Skip if this navigation was initiated by the hub
      if (isSyncingFromHubRef.current) {
        return;
      }

      // Clear any pending debounced navigation
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Debounce navigation messages to prevent spam during rapid navigation
      debounceTimeoutRef.current = setTimeout(() => {
        const hubPath = `/${moduleId}${path.startsWith('/') ? path : `/${path}`}`;
        hubClient.navigate(hubPath);
        debounceTimeoutRef.current = null;
      }, NAVIGATION_DEBOUNCE_MS);
    },
    [moduleId]
  );

  // Set up history.pushState/replaceState interception
  useEffect(() => {
    if (!isRunningInHub()) {
      return;
    }

    // Store original methods for cleanup
    originalPushStateRef.current = history.pushState.bind(history);
    originalReplaceStateRef.current = history.replaceState.bind(history);

    // Override pushState
    history.pushState = function (...args: Parameters<typeof history.pushState>) {
      originalPushStateRef.current!.apply(history, args);
      // Use setTimeout to ensure URL is updated
      setTimeout(() => {
        if (!isSyncingFromHubRef.current) {
          notifyHubDebounced(window.location.pathname);
        }
      }, 0);
    };

    // Override replaceState
    history.replaceState = function (...args: Parameters<typeof history.replaceState>) {
      originalReplaceStateRef.current!.apply(history, args);
      setTimeout(() => {
        if (!isSyncingFromHubRef.current) {
          notifyHubDebounced(window.location.pathname);
        }
      }, 0);
    };

    // Listen for popstate (browser back/forward within module)
    const handlePopState = () => {
      if (!isSyncingFromHubRef.current) {
        notifyHubDebounced(window.location.pathname);
      }
    };
    window.addEventListener('popstate', handlePopState);

    // Cleanup: restore original methods
    return () => {
      if (originalPushStateRef.current) {
        history.pushState = originalPushStateRef.current;
      }
      if (originalReplaceStateRef.current) {
        history.replaceState = originalReplaceStateRef.current;
      }
      window.removeEventListener('popstate', handlePopState);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [notifyHubDebounced]);

  // Listen for ROUTE_CHANGE from hub (browser back/forward at hub level)
  useEffect(() => {
    if (!isRunningInHub()) {
      return;
    }

    unsubscribeRouteChangeRef.current = hubClient.onRouteChange((payload) => {
      // Set flag to prevent loop
      isSyncingFromHubRef.current = true;

      try {
        // Extract the module-relative path from the hub path
        // Hub sends: /moduleId/some/path → we need: /some/path
        let modulePath = payload.path;
        const modulePrefix = `/${moduleId}`;
        if (modulePath.startsWith(modulePrefix)) {
          modulePath = modulePath.slice(modulePrefix.length) || '/';
        }

        // Build query string if present
        let fullPath = modulePath;
        if (payload.query && Object.keys(payload.query).length > 0) {
          const queryString = new URLSearchParams(payload.query).toString();
          fullPath = `${modulePath}?${queryString}`;
        }

        // Navigate using Next.js router
        router.push(fullPath);
      } finally {
        // Clear flag after a short delay to allow navigation to complete
        setTimeout(() => {
          isSyncingFromHubRef.current = false;
        }, 100);
      }
    });

    return () => {
      if (unsubscribeRouteChangeRef.current) {
        unsubscribeRouteChangeRef.current();
      }
    };
  }, [moduleId, router]);

  // Hijack anchor clicks
  useEffect(() => {
    if (!isRunningInHub()) {
      return;
    }

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Skip external, hash, mailto, and excluded paths
      if (
        href.startsWith('http') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        excludePaths.some((p) => href.startsWith(p))
      ) {
        return;
      }

      e.preventDefault();
      const normalizedPath = href.startsWith('/') ? href : `/${href}`;
      const hubPath = `/${moduleId}${normalizedPath}`;
      hubClient.navigate(hubPath);

      // Also update local router
      router.push(normalizedPath);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [moduleId, excludePaths, router]);

  // Return wrapped navigation functions for programmatic use
  return {
    push: useCallback(
      (path: string) => {
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        if (isRunningInHub()) {
          hubClient.navigate(`/${moduleId}${normalizedPath}`);
        }
        router.push(normalizedPath);
      },
      [moduleId, router]
    ),
    replace: useCallback(
      (path: string) => {
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        if (isRunningInHub()) {
          hubClient.navigate(`/${moduleId}${normalizedPath}`);
        }
        router.replace(normalizedPath);
      },
      [moduleId, router]
    ),
  };
}
