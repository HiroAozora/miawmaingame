import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google"; // Cuter font!
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: "miawmaingame",
  description: "A lightweight web game collection",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={fredoka.className}>{children}</body>
    </html>
  );
}
