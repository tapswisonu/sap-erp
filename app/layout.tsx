import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "XYZ Manufacturing | Smart Manufacturing Management Platform",
  description:
    "XYZ Manufacturing's intelligent ERP platform for real-time inventory, purchase, sales, and copper material tracking. Automate, analyze, and optimize your manufacturing operations.",
  keywords: [
    "manufacturing ERP",
    "inventory management",
    "production tracking",
    "industrial dashboard",
    "XYZ Manufacturing",
    "smart manufacturing",
  ],
  authors: [{ name: "XYZ Manufacturing" }],
  openGraph: {
    title: "XYZ Manufacturing | Smart Manufacturing Management",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
