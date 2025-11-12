import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "./components/Header";
import { ThemeProvider } from "./components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Memo Atelier",
  description: "Appleライクな体験を追求する、Markdown対応のクラフトメモアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" data-theme="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-500`}
      >
        <ThemeProvider>
          <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-0 opacity-80">
              <div className="glow-blob glow-1 absolute -left-32 top-20 h-72 w-72 rounded-full" />
              <div className="glow-blob glow-2 absolute right-0 top-0 h-96 w-96 rounded-full" />
              <div className="glow-blob glow-3 absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full" />
            </div>
            <div className="relative mx-auto w-full max-w-6xl px-6 pb-24">
              <Header />
              <main>{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
