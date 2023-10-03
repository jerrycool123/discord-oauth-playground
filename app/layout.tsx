import type { PropsWithChildren } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'inter-ui/inter.css';

import './globals.css';

import { RootProviders } from '../contexts/RootProviders';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
