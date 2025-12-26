'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual auth logic
      if (email && password) {
        // Simulate auth - in real app, call auth API
        localStorage.setItem('apollo_auth', JSON.stringify({ email }));
        router.push('/employees/list');
      } else {
        setError('Please enter email and password');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__header">
          <h1 className="login-page__title">Apollo Platform</h1>
          <p className="login-page__subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-page__form">
          {error && <div className="login-page__error">{error}</div>}

          <div className="login-page__field">
            <label htmlFor="email" className="login-page__label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-page__input"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="login-page__field">
            <label htmlFor="password" className="login-page__label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-page__input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="login-page__submit"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f5f5f5;
          padding: 1rem;
        }
        .login-page__container {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }
        .login-page__header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .login-page__title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 0.5rem;
        }
        .login-page__subtitle {
          color: #666;
          margin: 0;
        }
        .login-page__form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .login-page__error {
          background: #fee;
          color: #c00;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 0.875rem;
        }
        .login-page__field {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .login-page__label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #333;
        }
        .login-page__input {
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        .login-page__input:focus {
          outline: none;
          border-color: #0066cc;
          box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
        }
        .login-page__submit {
          padding: 0.75rem;
          background: #0066cc;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 0.5rem;
        }
        .login-page__submit:hover:not(:disabled) {
          background: #0052a3;
        }
        .login-page__submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
