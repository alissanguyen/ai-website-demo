'use client'

import { UserContextProvider } from '@/contexts/UserContext';
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <UserContextProvider>{children}</UserContextProvider>;
}