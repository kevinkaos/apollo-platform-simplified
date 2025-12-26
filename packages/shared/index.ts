// Re-export all types
export * from './types';

// Re-export navigation config and utilities
export { sidebarNav, findActiveNavPath, getDefaultExpandedSections } from './config/navigation';

// Re-export module config and utilities
export { modules, getModuleByPath, resolveModuleUrl, getModuleIdFromPath } from './config/modules';

// Alias for backwards compatibility
export { resolveModuleUrl as buildModuleUrl } from './config/modules';
export { getDefaultExpandedSections as getExpandedSectionsForPath } from './config/navigation';

// Constants
export const SIDEBAR_STORAGE_KEY = 'apollo-sidebar-state';
