import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/my-components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Análise Fatura C6 Bank",
  description: "Análise detalhada das faturas do C6 Bank",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 transition-all duration-300 ease-in-out md:ml-[var(--sidebar-width)]">
            {/* Spacer for the fixed mobile header in Sidebar.tsx - height should match mobile header */}
            <div className="h-16 md:hidden"></div>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
