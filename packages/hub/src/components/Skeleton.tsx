'use client';

import React from 'react';

// ============================================
// Skeleton Wrapper (Header + Content + Footer)
// ============================================

export function SkeletonShell() {
  return (
    <div className="skeleton-shell">
      <SkeletonHeader />
      <SkeletonContent />
      <SkeletonFooter />
    </div>
  );
}

// ============================================
// Header Skeleton
// ============================================

export function SkeletonHeader() {
  return (
    <header className="skeleton-header">
      {/* Breadcrumb placeholder */}
      <div className="skeleton-header__breadcrumbs">
        <div className="skeleton-bar skeleton-bar--sm" style={{ width: 60 }} />
        <span className="skeleton-header__separator">/</span>
        <div className="skeleton-bar skeleton-bar--sm" style={{ width: 80 }} />
        <span className="skeleton-header__separator">/</span>
        <div className="skeleton-bar skeleton-bar--sm" style={{ width: 100 }} />
      </div>

      {/* User area placeholder */}
      <div className="skeleton-header__user">
        <div className="skeleton-bar skeleton-bar--sm" style={{ width: 100 }} />
        <div className="skeleton-avatar" />
      </div>
    </header>
  );
}

// ============================================
// Content Skeleton
// ============================================

export function SkeletonContent() {
  return (
    <main className="skeleton-content">
      {/* Page title */}
      <div className="skeleton-content__title">
        <div className="skeleton-bar skeleton-bar--lg" style={{ width: 200 }} />
      </div>

      {/* Subtitle / description */}
      <div className="skeleton-content__subtitle">
        <div className="skeleton-bar" style={{ width: 350 }} />
      </div>

      {/* Content blocks */}
      <div className="skeleton-content__body">
        <div className="skeleton-bar" style={{ width: '100%' }} />
        <div className="skeleton-bar" style={{ width: '100%' }} />
        <div className="skeleton-bar" style={{ width: '80%' }} />
        <div className="skeleton-bar" style={{ width: '100%' }} />
        <div className="skeleton-bar" style={{ width: '60%' }} />
      </div>

      {/* Table skeleton */}
      <div className="skeleton-table">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-table__row">
            <div className="skeleton-table__cell" />
            <div className="skeleton-table__cell" />
            <div className="skeleton-table__cell" />
            <div className="skeleton-table__cell" />
          </div>
        ))}
      </div>
    </main>
  );
}

// ============================================
// Footer Skeleton
// ============================================

export function SkeletonFooter() {
  return (
    <footer className="skeleton-footer">
      <div className="skeleton-bar skeleton-bar--sm" style={{ width: 200 }} />
    </footer>
  );
}
