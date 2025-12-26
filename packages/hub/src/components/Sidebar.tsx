'use client';

import React from 'react';
import type { NavLevel1, SidebarState } from '@apollo/shared';
import { findActiveNavPath } from '@apollo/shared';

// Note: Replace with your UI library imports
// import { Sidebar as UISidebar, ... } from 'your-ui-library';

interface SidebarProps {
  nav: NavLevel1[];
  currentPath: string;
  state: SidebarState;
  onToggleCollapse: () => void;
  onToggleSection: (sectionId: string) => void;
  onNavigate: (path: string) => void;
}

export function Sidebar({
  nav,
  currentPath,
  state,
  onToggleCollapse,
  onToggleSection,
  onNavigate,
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
                {level1.children.map((level2) => (
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
                        {level2.children.map((level3) => (
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
