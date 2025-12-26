'use client';

import { useCallback, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModuleLoader } from '../../components/ModuleLoader';
import type { User } from '@apollo/shared';

// TODO: Replace with actual auth/user provider
function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored auth data
    const storedAuth = localStorage.getItem('apollo_auth');
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        setUser(authData.user);
      } catch (e) {
        console.error('[Hub] Failed to parse auth data:', e);
      }
    }
  }, []);

  const logout = useCallback(() => {
    // Clear auth data
    localStorage.removeItem('apollo_auth');
    document.cookie = 'apollo_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    // Redirect to login
    router.push('/login');
  }, [router]);

  return { user, logout };
}

export default function CatchallPage() {
  const { user, logout } = useAuth();

  return <ModuleLoader user={user} onLogout={logout} />;
}
