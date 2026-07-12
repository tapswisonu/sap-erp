import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ForgeAxis | Smart Manufacturing Management Platform",
  description:
    "ForgeAxis's intelligent ERP platform for real-time inventory, purchase, sales, and copper material tracking. Automate, analyze, and optimize your manufacturing operations.",
  keywords: [
    "manufacturing ERP",
    "inventory management",
    "production tracking",
    "industrial dashboard",
    "ForgeAxis",
    "smart manufacturing",
  ],
  authors: [{ name: "ForgeAxis" }],
  openGraph: {
    title: "ForgeAxis | Smart Manufacturing Management",
    description:
      "Enterprise-grade manufacturing ERP with real-time analytics, inventory control, and revenue optimization.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // handles iPhone notch / safe areas
};

import { ToastProvider } from "@/components/ui/toast";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
            <Toaster richColors position="top-right" theme="system" />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
