import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GOD MODE: Arcade Brother Build",
  description: "Bot-enabled online GOD MODE combat lab with instant brother drop-in.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
