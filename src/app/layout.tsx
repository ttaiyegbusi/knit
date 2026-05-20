import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Knit · Smart Suggestion",
  description:
    "An intimate space for you and your friends — meet consistently and meaningfully.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Loaded at runtime so the build doesn't depend on network access.
            Falls back gracefully to the CSS stack if unavailable. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400&family=Plus+Jakarta+Sans:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
