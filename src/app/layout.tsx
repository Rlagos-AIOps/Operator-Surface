import type { Metadata } from "next";
import { DM_Serif_Display, Manrope, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Masthead } from "@/components/site/masthead";
import { SiteFooter } from "@/components/site/footer";
import "./globals.css";

const serif = DM_Serif_Display({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const sans = Manrope({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const mono = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains",
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
      suppressHydrationWarning
      className={`${serif.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-dvh bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="app-bg pointer-events-none fixed inset-0 -z-10" aria-hidden />
          <div className="app-sweep pointer-events-none fixed inset-0 -z-10 animate-wave-drift" aria-hidden />
          <Masthead />
          <main className="min-h-[calc(100dvh-4.75rem)]">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
