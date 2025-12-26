import type { ModuleConfig } from '../types';

export const modules: ModuleConfig[] = [
  {
    id: 'employees',
    name: 'Employees',
    pathPrefix: '/employees',
    url: process.env.NEXT_PUBLIC_EMPLOYEES_URL || 'http://localhost:3001',
  },
  {
    id: 'payroll',
    name: 'Payroll',
    pathPrefix: '/payroll',
    url: process.env.NEXT_PUBLIC_PAYROLL_URL || 'http://localhost:3002',
  },
  {
    id: 'benefits',
    name: 'Benefits',
    pathPrefix: '/benefits',
    url: process.env.NEXT_PUBLIC_BENEFITS_URL || 'http://localhost:3003',
  },
];

/**
 * Find module by path prefix
 */
export function getModuleByPath(path: string): ModuleConfig | undefined {
  return modules.find((m) => path.startsWith(m.pathPrefix));
}

/**
 * Resolve full iframe URL from hub path
 * e.g., "/employees/list/123" → "http://localhost:3001/list/123"
 */
export function resolveModuleUrl(path: string): string | null {
  const module = getModuleByPath(path);
  if (!module) return null;

  const subPath = path.slice(module.pathPrefix.length) || '/';
  return `${module.url}${subPath}`;
}

/**
 * Get module ID from path
 */
export function getModuleIdFromPath(path: string): string | null {
  const module = getModuleByPath(path);
  return module?.id || null;
}
