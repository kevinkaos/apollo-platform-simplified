'use client';

import React, { forwardRef } from 'react';

interface IframeContainerProps {
  src: string;
  moduleId: string;
  visible: boolean;
  title?: string;
}

export const IframeContainer = forwardRef<HTMLIFrameElement, IframeContainerProps>(
  function IframeContainer({ src, moduleId, visible, title }, ref) {
    return (
      <iframe
        ref={ref}
        src={src}
        title={title || `Module: ${moduleId}`}
        className={`iframe-container ${visible ? 'iframe-container--visible' : 'iframe-container--hidden'}`}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        allow="clipboard-read; clipboard-write"
      />
    );
  }
);
