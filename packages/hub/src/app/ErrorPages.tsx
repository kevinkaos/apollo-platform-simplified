'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ErrorPageProps {
  code: 403 | 404 | 500;
  title: string;
  message: string;
}

function ErrorPage({ code, title, message }: ErrorPageProps) {
  const router = useRouter();

  return (
    <div className="error-page">
      <div className="error-page__content">
        <div className="error-page__code">{code}</div>
        <h1 className="error-page__title">{title}</h1>
        <p className="error-page__message">{message}</p>
        <div className="error-page__actions">
          <button onClick={() => router.back()} className="error-page__btn">
            Go Back
          </button>
          <button
            onClick={() => router.push('/employees/list')}
            className="error-page__btn error-page__btn--primary"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 403 - Forbidden
// ============================================

export function ForbiddenPage() {
  return (
    <ErrorPage
      code={403}
      title="Access Denied"
      message="You don't have permission to access this page."
    />
  );
}

// ============================================
// 404 - Not Found
// ============================================

export function NotFoundPage() {
  return (
    <ErrorPage
      code={404}
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
    />
  );
}

// ============================================
// 500 - Server Error
// ============================================

export function ServerErrorPage() {
  return (
    <ErrorPage
      code={500}
      title="Something Went Wrong"
      message="An unexpected error occurred. Please try again later."
    />
  );
}
