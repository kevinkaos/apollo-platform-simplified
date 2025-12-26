import { NavLevel1 } from '../types';

export const sidebarNav: NavLevel1[] = [
  {
    id: 'hr',
    label: 'HR Management',
    icon: 'users',
    children: [
      {
        id: 'employees',
        label: 'Employees',
        children: [
          { id: 'emp-list', label: 'Employee List', path: '/employees/list' },
          { id: 'emp-add', label: 'Add Employee', path: '/employees/add' },
          { id: 'emp-org', label: 'Organization', path: '/employees/org' },
          { id: 'emp-reports', label: 'Reports', path: '/employees/reports' },
        ],
      },
      {
        id: 'payroll',
        label: 'Payroll',
        children: [
          { id: 'pay-run', label: 'Run Payroll', path: '/payroll/run' },
          { id: 'pay-history', label: 'History', path: '/payroll/history' },
          { id: 'pay-settings', label: 'Settings', path: '/payroll/settings' },
        ],
      },
    ],
  },
  {
    id: 'benefits',
    label: 'Benefits',
    icon: 'heart',
    children: [
      {
        id: 'health',
        label: 'Health',
        children: [
          { id: 'health-plans', label: 'Plans', path: '/benefits/health/plans' },
          { id: 'health-claims', label: 'Claims', path: '/benefits/health/claims' },
          { id: 'health-providers', label: 'Providers', path: '/benefits/health/providers' },
        ],
      },
      {
        id: 'retirement',
        label: 'Retirement',
        children: [
          { id: 'retire-401k', label: '401(k)', path: '/benefits/retirement/401k' },
          { id: 'retire-pension', label: 'Pension', path: '/benefits/retirement/pension' },
        ],
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'settings',
    children: [
      {
        id: 'company',
        label: 'Company',
        children: [
          { id: 'company-profile', label: 'Profile', path: '/settings/company/profile' },
          { id: 'company-locations', label: 'Locations', path: '/settings/company/locations' },
        ],
      },
      {
        id: 'security',
        label: 'Security',
        children: [
          { id: 'security-users', label: 'Users', path: '/settings/security/users' },
          { id: 'security-roles', label: 'Roles', path: '/settings/security/roles' },
        ],
      },
    ],
  },
];

/**
 * Find active nav items by path
 */
export function findActiveNavPath(
  path: string
): { level1?: string; level2?: string; level3?: string } {
  for (const l1 of sidebarNav) {
    for (const l2 of l1.children) {
      for (const l3 of l2.children) {
        if (path.startsWith(l3.path)) {
          return { level1: l1.id, level2: l2.id, level3: l3.id };
        }
      }
    }
  }
  return {};
}

/**
 * Get default expanded sections (L1 and L2 IDs that should be open)
 */
export function getDefaultExpandedSections(path: string): string[] {
  const active = findActiveNavPath(path);
  const expanded: string[] = [];
  if (active.level1) expanded.push(active.level1);
  if (active.level2) expanded.push(active.level2);
  return expanded;
}
