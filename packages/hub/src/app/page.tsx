'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User, SidebarState } from '@apollo/shared';
import { sidebarNav } from '@apollo/shared';
import { ShellLayout } from '@apollo/sdk';
import {
  getSidebarState,
  setCollapsed,
  toggleSection,
} from '../hooks/sidebarState';

// TODO: Replace with actual auth/user provider
function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('apollo_auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setUser(authData.user);
      } catch (e) {
        console.error('[Hub] Failed to parse auth data:', e);
      }
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('apollo_auth');
    document.cookie = 'apollo_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  }, [router]);

  return { user, logout };
}

// Fake dashboard data
const stats = [
  { label: 'Total Employees', value: '247', icon: '👥' },
  { label: 'Open Positions', value: '12', icon: '📋' },
  { label: 'Pending Requests', value: '8', icon: '📝' },
  { label: 'Upcoming Reviews', value: '5', icon: '📅' },
];

const recentActivity = [
  { id: 1, text: 'Sarah Johnson was added as a new employee', time: '2 hours ago' },
  { id: 2, text: 'Payroll for December was processed', time: '5 hours ago' },
  { id: 3, text: 'Benefits enrollment period opened', time: '1 day ago' },
  { id: 4, text: 'John Smith updated his direct deposit info', time: '2 days ago' },
  { id: 5, text: 'Q4 performance reviews completed', time: '3 days ago' },
];

const quickActions = [
  { label: 'Add Employee', path: '/employees/add', icon: '➕' },
  { label: 'Run Payroll', path: '/payroll/run', icon: '💰' },
  { label: 'View Reports', path: '/employees/reports', icon: '📊' },
  { label: 'Company Settings', path: '/settings/company/profile', icon: '⚙️' },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [sidebarState, setSidebarStateLocal] = useState<SidebarState>(getSidebarState);

  const handleNavigate = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  const handleToggleCollapse = useCallback(() => {
    const newCollapsed = !sidebarState.collapsed;
    setCollapsed(newCollapsed);
    setSidebarStateLocal({ ...sidebarState, collapsed: newCollapsed });
  }, [sidebarState]);

  const handleToggleSection = useCallback((sectionId: string) => {
    toggleSection(sectionId);
    setSidebarStateLocal(getSidebarState());
  }, []);

  return (
    <ShellLayout
      nav={sidebarNav}
      currentPath="/"
      sidebarState={sidebarState}
      user={user}
      breadcrumbs={[{ label: 'Dashboard', path: '/' }]}
      onNavigate={handleNavigate}
      onToggleSidebarCollapse={handleToggleCollapse}
      onToggleSidebarSection={handleToggleSection}
      onLogout={logout}
    >
      <div className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__title">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </h1>
          <p className="dashboard__subtitle">Here's what's happening with your organization today.</p>
        </div>

        <div className="dashboard__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <span className="stat-card__icon">{stat.icon}</span>
              <div className="stat-card__content">
                <span className="stat-card__value">{stat.value}</span>
                <span className="stat-card__label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard__grid">
          <div className="dashboard__section">
            <h2 className="dashboard__section-title">Recent Activity</h2>
            <ul className="activity-list">
              {recentActivity.map((item) => (
                <li key={item.id} className="activity-item">
                  <span className="activity-item__text">{item.text}</span>
                  <span className="activity-item__time">{item.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="dashboard__section">
            <h2 className="dashboard__section-title">Quick Actions</h2>
            <div className="quick-actions">
              {quickActions.map((action) => (
                <button
                  key={action.path}
                  className="quick-action"
                  onClick={() => handleNavigate(action.path)}
                >
                  <span className="quick-action__icon">{action.icon}</span>
                  <span className="quick-action__label">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ShellLayout>
  );
}
