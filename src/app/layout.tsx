import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "FaviconForge — Generate Perfect Favicons in Seconds",
  description: "Create stunning favicons, app icons, and web manifests from a brand name. Export in every format — SVG, PNG, ICO — and ship faster.",
  keywords: ["favicon generator", "app icon maker", "web manifest", "favicon creator", "icon generator"],
  authors: [{ name: "FaviconForge" }],
  openGraph: {
    title: "FaviconForge — Generate Perfect Favicons in Seconds",
    description: "Create stunning favicons, app icons, and web manifests from a brand name.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FaviconForge — Generate Perfect Favicons in Seconds",
    description: "Create stunning favicons, app icons, and web manifests from a brand name.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
