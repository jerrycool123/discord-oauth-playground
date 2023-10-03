'use client';

import type { PropsWithChildren } from 'react';

import { RequestResponseProvider } from './RequestResponseProvider';
import { SessionStorageProvider } from './SessionStorageProvider';
import { ThemeProvider } from './ThemeProvider';

export const RootProviders = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider>
      <SessionStorageProvider>
        <RequestResponseProvider>{children}</RequestResponseProvider>
      </SessionStorageProvider>
    </ThemeProvider>
  );
};
