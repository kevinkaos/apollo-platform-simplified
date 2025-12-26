'use client';

import React from 'react';
import type { User, BreadcrumbItem } from '@apollo/shared';

// Note: Replace with your UI library imports
// import { Header as UIHeader, Breadcrumb } from 'your-ui-library';

interface HeaderProps {
  user: User | null;
  breadcrumbs: BreadcrumbItem[];
  onLogout: () => void;
  onBreadcrumbClick: (path: string) => void;
}

export function Header({ user, breadcrumbs, onLogout, onBreadcrumbClick }: HeaderProps) {
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
                  {item.path && !isLast ? (
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
            <img
              src={user.avatar || '/default-avatar.png'}
              alt={user.name}
              className="apollo-header__avatar"
            />
            <span className="apollo-header__username">{user.name}</span>
            <button className="apollo-header__logout" onClick={onLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}
