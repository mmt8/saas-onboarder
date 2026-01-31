import type { Metadata } from "next";
import { Gabarito, Fraunces, Inter } from "next/font/google"; // Import fonts
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { RecordingOverlay } from "@/components/admin/RecordingOverlay";
import { StepEditor } from "@/components/admin/StepEditor";
import { AuthProvider } from "@/components/AuthProvider";
import { CookieConsent } from "@/components/CookieConsent";
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
  title: "Product Tour: Interactive Product Tours & User Onboarding Software",
  description: "AI-powered product tour software that auto-generates on-brand walkthroughs from your UI in seconds. Install with one line of code. No complex setup required.",
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
          <main className="min-h-screen">
            {children}
          </main>
          <CookieConsent />
        </AuthProvider>
        {/* Product Tour Widget - dogfooding our own product */}
        <script
          src="https://naiuhnzdampxdewizhin.supabase.co/storage/v1/object/public/widgets/embed.js"
          data-project-id="9d388f42-fafb-4a64-b1bd-c9254e38bb8c"
          defer
        />
      </body>
    </html>
  );
}

