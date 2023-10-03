import { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'inter-ui/inter.css';

import './globals.css';

import { RootProviders } from '../contexts/RootProviders';

export const metadata: Metadata = {
  title: 'Discord OAuth 2.0 Playground',
  description:
    'The Discord OAuth 2.0 Playground helps you to play with OAuth 2.0 and make API requests.',
  other: {
    'google-site-verification': '2mKNWgX4OXy7j6Bmhf37edNJ1jXgXCbYObAfdMS2mqk',
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
