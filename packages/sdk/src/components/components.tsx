import React from 'react';
import { User, BreadcrumbItem, SidebarState, NavLevel1 } from '@apollo/shared';
import { sidebarNav, findActiveNavItems } from '@apollo/shared';

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
    <header className="sdk-header">
      {/* Breadcrumbs */}
      <nav className="sdk-header__breadcrumbs">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="sdk-header__separator">/</span>}
            {item.path && onBreadcrumbClick ? (
              <button
                className="sdk-header__breadcrumb-link"
                onClick={() => onBreadcrumbClick(item.path!)}
              >
                {item.label}
              </button>
            ) : (
              <span className="sdk-header__breadcrumb-current">{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* User area */}
      <div className="sdk-header__user">
        {user && (
          <>
            <span className="sdk-header__username">{user.name}</span>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="sdk-header__avatar" />
            ) : (
              <div className="sdk-header__avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            {onLogout && (
              <button className="sdk-header__logout" onClick={onLogout}>
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
  return (
    <footer className="sdk-footer">
      <span>© {new Date().getFullYear()} {companyName}. All rights reserved.</span>
    </footer>
  );
}

// ============================================
// Sidebar (SDK version - mirrors Hub's)
// ============================================

export interface SidebarProps {
  currentPath: string;
  state: SidebarState;
  onNavigate: (path: string) => void;
  onToggleCollapse: () => void;
  onToggleSection: (sectionId: string) => void;
}

export function Sidebar({
  currentPath,
  state,
  onNavigate,
  onToggleCollapse,
  onToggleSection,
}: SidebarProps) {
  const activeItems = findActiveNavItems(currentPath);
  const { collapsed, expandedSections } = state;

  const isExpanded = (id: string) => expandedSections.includes(id);

  return (
    <aside className={`sdk-sidebar ${collapsed ? 'sdk-sidebar--collapsed' : ''}`}>
      {/* Header */}
      <div className="sdk-sidebar__header">
        <div className="sdk-sidebar__logo">
          <span className="sdk-sidebar__logo-icon">A</span>
          {!collapsed && <span className="sdk-sidebar__logo-text">Apollo</span>}
        </div>
        <button className="sdk-sidebar__collapse-btn" onClick={onToggleCollapse}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sdk-sidebar__nav">
        {sidebarNav.map((level1) => (
          <div
            key={level1.id}
            className={`sdk-sidebar__l1 ${
              activeItems.level1Id === level1.id ? 'sdk-sidebar__l1--active' : ''
            }`}
          >
            <button
              className="sdk-sidebar__l1-btn"
              onClick={() => onToggleSection(level1.id)}
            >
              {level1.icon && <span className="sdk-sidebar__icon">{level1.icon}</span>}
              {!collapsed && (
                <>
                  <span className="sdk-sidebar__label">{level1.label}</span>
                  <span
                    className={`sdk-sidebar__chevron ${
                      isExpanded(level1.id) ? 'sdk-sidebar__chevron--open' : ''
                    }`}
                  >
                    ▶
                  </span>
                </>
              )}
            </button>

            {!collapsed && isExpanded(level1.id) && (
              <div className="sdk-sidebar__l1-children">
                {level1.children.map((level2) => (
                  <div
                    key={level2.id}
                    className={`sdk-sidebar__l2 ${
                      activeItems.level2Id === level2.id ? 'sdk-sidebar__l2--active' : ''
                    }`}
                  >
                    <button
                      className="sdk-sidebar__l2-btn"
                      onClick={() => onToggleSection(level2.id)}
                    >
                      <span className="sdk-sidebar__label">{level2.label}</span>
                      <span
                        className={`sdk-sidebar__chevron ${
                          isExpanded(level2.id) ? 'sdk-sidebar__chevron--open' : ''
                        }`}
                      >
                        ▶
                      </span>
                    </button>

                    {isExpanded(level2.id) && (
                      <div className="sdk-sidebar__l2-children">
                        {level2.children.map((level3) => (
                          <button
                            key={level3.id}
                            className={`sdk-sidebar__l3 ${
                              activeItems.level3Id === level3.id ? 'sdk-sidebar__l3--active' : ''
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
