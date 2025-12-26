'use client';

import React from 'react';

export function ContentSkeleton() {
  return (
    <div className="content-skeleton" aria-hidden="true">
      {/* Title area */}
      <div className="content-skeleton__header">
        <div className="skeleton-bar skeleton-bar--title" />
        <div className="skeleton-bar skeleton-bar--subtitle" />
      </div>

      {/* Content area */}
      <div className="content-skeleton__body">
        <div className="skeleton-bar skeleton-bar--full" />
        <div className="skeleton-bar skeleton-bar--full" />
        <div className="skeleton-bar skeleton-bar--medium" />
        <div className="skeleton-bar skeleton-bar--full" />
        <div className="skeleton-bar skeleton-bar--short" />
      </div>

      {/* Table-like area */}
      <div className="content-skeleton__table">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="content-skeleton__row">
            <div className="skeleton-bar skeleton-bar--cell" />
            <div className="skeleton-bar skeleton-bar--cell" />
            <div className="skeleton-bar skeleton-bar--cell" />
            <div className="skeleton-bar skeleton-bar--cell" />
          </div>
        ))}
      </div>
    </div>
  );
}
