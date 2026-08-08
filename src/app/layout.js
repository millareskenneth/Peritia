import { AppProviders } from '../language-themes/AppProviders';
import { mantineHtmlProps } from '@mantine/core';
import { IBM_Plex_Sans, IBM_Plex_Mono, Barlow, Cormorant_Garamond, Libre_Baskerville, Share_Tech_Mono } from 'next/font/google';
import '@mantine/core/styles.css';
import './globals.css';
import '../language-themes/languages.css';

const ibmPlexSans = IBM_Plex_Sans({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

const barlow = Barlow({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-barlow',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
});

const libre = Libre_Baskerville({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-libre',
  display: 'swap',
});

const shareTech = Share_Tech_Mono({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-share-tech',
  display: 'swap',
});

export const metadata = {
  title: 'PeritiaOS — Developer Operating System Documentation Portal',
  description: 'Technical documentation and system architecture for PeritiaOS, a developer-first Linux distribution.',
  icons: {
    icon: '/peritia.svg',
    shortcut: '/peritia.svg',
    apple: '/peritia.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-lang="cobol"
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} ${barlow.variable} ${cormorant.variable} ${libre.variable} ${shareTech.variable}`}
      {...mantineHtmlProps}
    >
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
