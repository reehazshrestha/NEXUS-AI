import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/components/ThemeProvider";
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
  title: "NexusAI — Intelligent Conversations, Powered by AI",
  description:
    "Experience the next generation of AI chat. Fast, intelligent, and secure conversations powered by cutting-edge AI technology.",
  keywords: ["AI", "chatbot", "artificial intelligence", "NexusAI", "chat"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "oklch(0.2 0.01 270)",
              color: "oklch(0.95 0 0)",
              border: "1px solid oklch(1 0 0 / 10%)",
              borderRadius: "0.75rem",
            },
          }}
        />
      </body>
    </html>
  );
}
