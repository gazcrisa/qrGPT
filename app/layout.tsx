import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';


// export const metadata: Metadata = {
//   title: "Medication POC",
//   description:
//     "A poc",
// };

const inter = Inter({ subsets: ['latin'] });

let title = 'A poc';
let description = '';
let url = 'https://qr-gpt-three-fawn.vercel.app/';
let ogimage = 'https://qr-gpt-three-fawn/og-image.png';
let sitename = 'qr-gpt-three-fawn';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
