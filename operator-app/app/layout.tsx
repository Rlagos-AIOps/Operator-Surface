import type { Metadata } from "next";
import { DM_Serif_Display, Manrope, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Masthead } from "@/components/site/masthead";
import { SiteFooter } from "@/components/site/footer";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ops Surfer — the operator surface for AI consultancies",
  description:
    "Run your consultancy like an operator, not a corporate. Client CRM, ROI-backed pricing, and a multi-agent delivery layer.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSerif.variable} ${manrope.variable} ${jetbrains.variable} h-full`}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="app-bg pointer-events-none fixed inset-0 -z-10" aria-hidden />
          <div className="app-sweep pointer-events-none fixed inset-0 z-[5] animate-wave-drift" aria-hidden />
          <Masthead />
          <main className="min-h-[calc(100dvh-4.75rem)]">{children}</main>
          <SiteFooter />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--color-card)",
                color: "var(--color-foreground)",
                border: "1px solid var(--color-border)",
                backdropFilter: "blur(16px)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
