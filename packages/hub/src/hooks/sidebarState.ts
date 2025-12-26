import { SidebarState } from '@apollo/shared';

const STORAGE_KEY = 'apollo-sidebar-state';

const DEFAULT_STATE: SidebarState = {
  collapsed: false,
  expandedSections: [],
};

/**
 * Get sidebar state from localStorage
 */
export function getSidebarState(): SidebarState {
  if (typeof window === 'undefined') return DEFAULT_STATE;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_STATE;
    return JSON.parse(stored);
  } catch {
    return DEFAULT_STATE;
  }
}

/**
 * Save sidebar state to localStorage
 */
export function setSidebarState(state: SidebarState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage might be full or disabled
  }
}

/**
 * Update collapsed state only
 */
export function setCollapsed(collapsed: boolean): void {
  const current = getSidebarState();
  setSidebarState({ ...current, collapsed });
}

/**
 * Toggle a section's expanded state
 */
export function toggleSection(sectionId: string): void {
  const current = getSidebarState();
  const expandedSections = current.expandedSections.includes(sectionId)
    ? current.expandedSections.filter((id) => id !== sectionId)
    : [...current.expandedSections, sectionId];
  setSidebarState({ ...current, expandedSections });
}

/**
 * Set expanded sections (replaces all)
 */
export function setExpandedSections(sections: string[]): void {
  const current = getSidebarState();
  setSidebarState({ ...current, expandedSections: sections });
}
