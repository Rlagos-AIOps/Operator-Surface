import type { Metadata } from "next";
import { DM_Serif_Display, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const serif = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-serif-family",
  display: "swap",
});

const sans = Manrope({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-sans-family",
  display: "swap",
});

const mono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-mono-family",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Operator Surface",
  description:
    "See what your AI agents did. Approve what they want to do next.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-paper font-sans">{children}</body>
    </html>
  );
}
