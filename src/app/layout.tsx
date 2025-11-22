import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { RecordingOverlay } from "@/components/admin/RecordingOverlay";
import { StepEditor } from "@/components/admin/StepEditor";
import { TourPlayer } from "@/components/player/TourPlayer";
import { InteractiveAssistant } from "@/components/InteractiveAssistant";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "SaaS Onboarder",
  description: "Create interactive product tours in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navbar />
        <AdminToolbar />
        <RecordingOverlay />
        <StepEditor />
        <Suspense fallback={null}>
          <TourPlayer />
        </Suspense>
        <InteractiveAssistant />
        <main className="min-h-screen pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
