import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { RecordingOverlay } from "@/components/admin/RecordingOverlay";
import { StepEditor } from "@/components/admin/StepEditor";
import { TourPlayer } from "@/components/player/TourPlayer";
import { Suspense } from "react";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "GuideMark",
  description: "Create interactive product tours in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <AdminToolbar />
          <RecordingOverlay />
          <StepEditor />
          <Suspense fallback={null}>
            <TourPlayer />
          </Suspense>
          <main className="min-h-screen pt-20">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
