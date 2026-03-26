import type { Metadata } from "next";
import "./globals.css";
import { TopNavLoader } from "@/components/top-nav-loader";

export const metadata: Metadata = {
  title: "APEX — AI Trading Terminal",
  description: "Autonomous AI-powered crypto trading system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen grid-bg">
        <TopNavLoader />
        {children}
      </body>
    </html>
  );
}
