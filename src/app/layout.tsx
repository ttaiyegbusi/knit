import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted Baloo 2 (variable). Bundled with the app — never fetched over
// the network, so the build is offline-safe and the typeface is exactly the
// one provided.
const baloo = localFont({
  src: "./fonts/Baloo2.ttf",
  variable: "--font-baloo",
  display: "swap",
  weight: "400 800",
});

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
      <body className={`${baloo.variable} antialiased`}>{children}</body>
    </html>
  );
}
