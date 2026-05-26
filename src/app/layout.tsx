import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PageForge v2 — WordPress Theme & Plugin Generator",
  description:
    "El primer generador visual de themes y plugins de WordPress que funciona sin WordPress. Disena, genera archivos PHP validos y exporta como ZIP listo para instalar.",
  keywords: [
    "PageForge",
    "WordPress theme generator",
    "WordPress plugin generator",
    "visual theme builder",
    "WordPress export",
    "PHP generator",
    "no-code WordPress",
  ],
  authors: [{ name: "PageForge" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "PageForge v2 — WordPress Theme & Plugin Generator",
    description:
      "Genera themes y plugins de WordPress de forma visual. Exporta archivos PHP validos como ZIP.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PageForge v2 — WordPress Theme & Plugin Generator",
    description:
      "Genera themes y plugins de WordPress de forma visual. Exporta archivos PHP validos como ZIP.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
