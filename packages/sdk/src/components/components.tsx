import React from 'react';
import type { User, BreadcrumbItem, SidebarState, NavLevel1, NavLevel2, NavLevel3 } from '@apollo/shared';
import { sidebarNav, findActiveNavPath } from '@apollo/shared';

// TODO: Replace these with actual UI library imports
// import {
//   Sidebar as UISidebar,
//   Header as UIHeader,
//   Footer as UIFooter,
//   Breadcrumb as UIBreadcrumb,
// } from 'your-ui-library';

// ============================================
// Header
// ============================================

export interface HeaderProps {
  user: User | null;
  breadcrumbs: BreadcrumbItem[];
  onBreadcrumbClick?: (path: string) => void;
  onLogout?: () => void;
}

export function Header({ user, breadcrumbs, onBreadcrumbClick, onLogout }: HeaderProps) {
  return (
    <header className="apollo-header">
      {/* Breadcrumbs */}
      <nav className="apollo-header__breadcrumbs" aria-label="Breadcrumb">
        {breadcrumbs.length > 0 && (
          <ol className="apollo-breadcrumbs__list">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={index} className="apollo-breadcrumbs__item">
                  {item.path && !isLast && onBreadcrumbClick ? (
                    <button
                      className="apollo-breadcrumbs__link"
                      onClick={() => onBreadcrumbClick(item.path!)}
                    >
                      {item.label}
                    </button>
                  ) : (
                    <span className="apollo-breadcrumbs__current">{item.label}</span>
                  )}
                  {!isLast && <span className="apollo-breadcrumbs__separator">/</span>}
                </li>
              );
            })}
          </ol>
        )}
      </nav>

      {/* User area */}
      <div className="apollo-header__user">
        {user && (
          <>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="apollo-header__avatar" />
            ) : (
              <div className="apollo-header__avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="apollo-header__username">{user.name}</span>
            {onLogout && (
              <button className="apollo-header__logout" onClick={onLogout}>
                Logout
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
}

// ============================================
// Footer
// ============================================

export interface FooterProps {
  companyName?: string;
}

export function Footer({ companyName = 'Apollo Platform' }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="apollo-footer">
      <span className="apollo-footer__copyright">
        © {year} {companyName}. All rights reserved.
      </span>
    </footer>
  );
}

// ============================================
// Sidebar
// ============================================

export interface SidebarProps {
  nav?: NavLevel1[];
  currentPath: string;
  state: SidebarState;
  onNavigate: (path: string) => void;
  onToggleCollapse: () => void;
  onToggleSection: (sectionId: string) => void;
}

export function Sidebar({
  nav = sidebarNav,
  currentPath,
  state,
  onNavigate,
  onToggleCollapse,
  onToggleSection,
}: SidebarProps) {
  const activePath = findActiveNavPath(currentPath);
  const { collapsed, expandedSections } = state;

  const isExpanded = (sectionId: string) => expandedSections.includes(sectionId);

  return (
    <aside className={`apollo-sidebar ${collapsed ? 'apollo-sidebar--collapsed' : ''}`}>
      {/* Logo & Collapse Toggle */}
      <div className="apollo-sidebar__header">
        <div className="apollo-sidebar__logo">
          <span>Apollo</span>
        </div>
        <button
          className="apollo-sidebar__toggle"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="apollo-sidebar__nav">
        {nav.map((level1) => (
          <div key={level1.id} className="apollo-sidebar__level1">
            {/* Level 1 */}
            <button
              className={`apollo-sidebar__level1-header ${
                activePath.level1 === level1.id ? 'apollo-sidebar__level1-header--active' : ''
              }`}
              onClick={() => onToggleSection(level1.id)}
              aria-expanded={isExpanded(level1.id)}
            >
              {level1.icon && <span className="apollo-sidebar__icon">{level1.icon}</span>}
              {!collapsed && (
                <>
                  <span className="apollo-sidebar__label">{level1.label}</span>
                  <span className="apollo-sidebar__chevron">
                    {isExpanded(level1.id) ? '▼' : '▶'}
                  </span>
                </>
              )}
            </button>

            {/* Level 2 & 3 */}
            {!collapsed && isExpanded(level1.id) && (
              <div className="apollo-sidebar__level1-content">
                {level1.children.map((level2: NavLevel2) => (
                  <div key={level2.id} className="apollo-sidebar__level2">
                    <button
                      className={`apollo-sidebar__level2-header ${
                        activePath.level2 === level2.id ? 'apollo-sidebar__level2-header--active' : ''
                      }`}
                      onClick={() => onToggleSection(level2.id)}
                      aria-expanded={isExpanded(level2.id)}
                    >
                      <span className="apollo-sidebar__label">{level2.label}</span>
                      <span className="apollo-sidebar__chevron">
                        {isExpanded(level2.id) ? '▼' : '▶'}
                      </span>
                    </button>

                    {/* Level 3 (clickable) */}
                    {isExpanded(level2.id) && (
                      <div className="apollo-sidebar__level2-content">
                        {level2.children.map((level3: NavLevel3) => (
                          <button
                            key={level3.id}
                            className={`apollo-sidebar__level3-item ${
                              activePath.level3 === level3.id
                                ? 'apollo-sidebar__level3-item--active'
                                : ''
                            }`}
                            onClick={() => onNavigate(level3.path)}
                          >
                            {level3.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
