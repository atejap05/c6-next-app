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
          <main className="flex-1 p-4 md:p-8 transition-all duration-300 ease-in-out md:ml-[var(--sidebar-width)]">
            {/* The md:ml-64 is replaced by a CSS variable that will be set in globals.css or by JS */}
            {/* Add a top bar for mobile if needed, or integrate menu into a header */}
            <div className="md:hidden h-16"></div>{" "}
            {/* Spacer for mobile fixed menu button */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
