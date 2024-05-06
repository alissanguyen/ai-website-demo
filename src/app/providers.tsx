'use client'

import { UserContextProvider } from '@/contexts/UserContext';
import React from 'react';
import AuthWrapper from '@/components/AuthWrapper/AuthWrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthWrapper>
      <UserContextProvider>{children}</UserContextProvider>
    </AuthWrapper>
  );
}