'use client';

import React from 'react';

// Note: Replace with your UI library imports
// import { Footer as UIFooter } from 'your-ui-library';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="apollo-footer">
      <span className="apollo-footer__copyright">
        © {year} Apollo Platform. All rights reserved.
      </span>
    </footer>
  );
}
