'use client';

import React, { useRef, useEffect } from 'react';

interface IframeContainerProps {
  src: string;
  moduleId: string;
  visible: boolean;
  title?: string;
}

export function IframeContainer({ src, moduleId, visible, title }: IframeContainerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Expose iframe ref for potential parent access
  useEffect(() => {
    if (iframeRef.current) {
      // Could dispatch custom event or use callback if parent needs ref
    }
  }, [src]);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      title={title || `Module: ${moduleId}`}
      className={`iframe-container ${visible ? 'iframe-container--visible' : 'iframe-container--hidden'}`}
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      allow="clipboard-read; clipboard-write"
    />
  );
}
