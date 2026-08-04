import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

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

export const metadata = {
  title: 'PeritiaOS — Developer Operating System Documentation Portal',
  description: 'Technical documentation, 12-month engineering bootcamp curriculum, and prerequisites guide for PeritiaOS.',
  icons: {
    icon: '/peritia.svg',
    shortcut: '/peritia.svg',
    apple: '/peritia.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
