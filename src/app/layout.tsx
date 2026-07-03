import type { Metadata, Viewport } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/constants/app";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white text-foreground antialiased">{children}</body>
    </html>
  );
}
