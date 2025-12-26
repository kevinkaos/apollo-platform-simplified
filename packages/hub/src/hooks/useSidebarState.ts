'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SidebarState } from '@apollo/shared';
import { SIDEBAR_STORAGE_KEY, getDefaultExpandedSections } from '@apollo/shared';

const DEFAULT_STATE: SidebarState = {
  collapsed: false,
  expandedSections: [],
};

function loadState(): SidebarState {
  if (typeof window === 'undefined') return DEFAULT_STATE;

  try {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return DEFAULT_STATE;
}

function saveState(state: SidebarState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

export function useSidebarState(currentPath: string) {
  const [state, setState] = useState<SidebarState>(DEFAULT_STATE);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadState();

    // If no expanded sections, expand based on current path
    if (loaded.expandedSections.length === 0) {
      loaded.expandedSections = getDefaultExpandedSections(currentPath);
    }

    setState(loaded);
    setIsInitialized(true);
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      saveState(state);
    }
  }, [state, isInitialized]);

  const setCollapsed = useCallback((collapsed: boolean) => {
    setState((prev) => ({ ...prev, collapsed }));
  }, []);

  const toggleCollapsed = useCallback(() => {
    setState((prev) => ({ ...prev, collapsed: !prev.collapsed }));
  }, []);

  const toggleSection = useCallback((sectionId: string) => {
    setState((prev) => {
      const isExpanded = prev.expandedSections.includes(sectionId);
      return {
        ...prev,
        expandedSections: isExpanded
          ? prev.expandedSections.filter((id) => id !== sectionId)
          : [...prev.expandedSections, sectionId],
      };
    });
  }, []);

  const setSidebarState = useCallback((newState: SidebarState) => {
    setState(newState);
  }, []);

  return {
    state,
    isInitialized,
    setCollapsed,
    toggleCollapsed,
    toggleSection,
    setSidebarState,
  };
}
