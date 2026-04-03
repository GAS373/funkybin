import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Escape From Hallucination City | funkybin.dev",
  description:
    "A one-page sci-fi learning game about validating AI answers before you trust them.",
  metadataBase: new URL("https://funkybin.dev"),
  openGraph: {
    title: "Escape From Hallucination City | funkybin.dev",
    description:
      "Restore a broken AI city by catching hallucinations in docs, debugging, SQL, regex, and commit workflows.",
    url: "https://funkybin.dev",
    siteName: "funkybin.dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Escape From Hallucination City",
    description:
      "Learn how to validate AI output through a one-page sci-fi game.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${plexMono.variable}`}>
        {children}
      </body>
    </html>
  );
}