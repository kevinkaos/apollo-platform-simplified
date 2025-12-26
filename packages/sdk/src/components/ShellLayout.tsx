'use client';

import React, { ReactNode } from 'react';
import { Sidebar } from './components';
import { Header } from './components';
import { Footer } from './components';
import type { NavLevel1, SidebarState, User, BreadcrumbItem } from '@apollo/shared';
import { sidebarNav } from '@apollo/shared';

export interface ShellLayoutProps {
  children: ReactNode;
  nav?: NavLevel1[];
  currentPath: string;
  sidebarState: SidebarState;
  user: User | null;
  breadcrumbs: BreadcrumbItem[];
  onNavigate: (path: string) => void;
  onToggleSidebarCollapse: () => void;
  onToggleSidebarSection: (sectionId: string) => void;
  onLogout: () => void;
}

export function ShellLayout({
  children,
  nav = sidebarNav,
  currentPath,
  sidebarState,
  user,
  breadcrumbs,
  onNavigate,
  onToggleSidebarCollapse,
  onToggleSidebarSection,
  onLogout,
}: ShellLayoutProps) {
  return (
    <div
      className={`apollo-shell ${sidebarState.collapsed ? 'apollo-shell--sidebar-collapsed' : ''}`}
    >
      <Sidebar
        nav={nav}
        currentPath={currentPath}
        state={sidebarState}
        onToggleCollapse={onToggleSidebarCollapse}
        onToggleSection={onToggleSidebarSection}
        onNavigate={onNavigate}
      />

      <div className="apollo-shell__main">
        <Header
          user={user}
          breadcrumbs={breadcrumbs}
          onLogout={onLogout}
          onBreadcrumbClick={onNavigate}
        />

        <main className="apollo-shell__content">{children}</main>

        <Footer />
      </div>
    </div>
  );
}
