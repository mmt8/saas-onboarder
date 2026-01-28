import type { Metadata } from "next";
import { Gabarito, Fraunces, Inter } from "next/font/google"; // Import fonts
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { RecordingOverlay } from "@/components/admin/RecordingOverlay";
import { StepEditor } from "@/components/admin/StepEditor";
import { TourPlayer } from "@/components/player/TourPlayer";
import { Suspense } from "react";
import { AuthProvider } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

const gabarito = Gabarito({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://producttour.app'),
  title: "Product Tour",
  description: "The easiest way to create interactive high-fidelity tours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("font-sans antialiased", gabarito.variable, fraunces.variable, inter.variable)} suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <AdminToolbar />
          <RecordingOverlay />
          <StepEditor />
          <Suspense fallback={null}>
            <TourPlayer />
          </Suspense>
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
