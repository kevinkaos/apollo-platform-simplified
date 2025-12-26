'use client';

import React from 'react';

export interface ErrorDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Error title */
  title?: string;
  /** Error message to display */
  message: string;
  /** Text for the primary action button (e.g., "Retry", "OK") */
  actionLabel?: string;
  /** Called when the primary action button is clicked */
  onAction?: () => void;
  /** Text for the dismiss button (e.g., "Cancel", "Close") */
  dismissLabel?: string;
  /** Called when the dialog is dismissed */
  onDismiss?: () => void;
  /** Error code for styling/categorization */
  errorCode?: 'warning' | 'error' | 'info';
}

export function ErrorDialog({
  isOpen,
  title = 'Error',
  message,
  actionLabel = 'OK',
  onAction,
  dismissLabel,
  onDismiss,
  errorCode = 'error',
}: ErrorDialogProps) {
  if (!isOpen) {
    return null;
  }

  const handleAction = () => {
    onAction?.();
  };

  const handleDismiss = () => {
    onDismiss?.();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleDismiss();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleDismiss();
    }
  };

  return (
    <div
      className="apollo-error-dialog__backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="apollo-error-dialog-title"
      aria-describedby="apollo-error-dialog-message"
    >
      <div className={`apollo-error-dialog apollo-error-dialog--${errorCode}`}>
        <h2 id="apollo-error-dialog-title" className="apollo-error-dialog__title">
          {title}
        </h2>
        <p id="apollo-error-dialog-message" className="apollo-error-dialog__message">
          {message}
        </p>
        <div className="apollo-error-dialog__actions">
          {dismissLabel && onDismiss && (
            <button
              type="button"
              className="apollo-error-dialog__button apollo-error-dialog__button--secondary"
              onClick={handleDismiss}
            >
              {dismissLabel}
            </button>
          )}
          <button
            type="button"
            className="apollo-error-dialog__button apollo-error-dialog__button--primary"
            onClick={handleAction}
            autoFocus
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
