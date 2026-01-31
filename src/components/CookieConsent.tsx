"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Small delay for smoother page load
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    const handleDismiss = () => {
        localStorage.setItem("cookie-consent", "dismissed");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-2xl mx-auto bg-card border border-border rounded-2xl shadow-xl shadow-black/10 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1 text-sm text-muted-foreground">
                    We use cookies for authentication and essential functionality only.{" "}
                    <Link href="/privacy" className="text-primary hover:underline font-medium">
                        Learn more
                    </Link>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <Button
                        onClick={handleAccept}
                        size="sm"
                        className="rounded-full px-5 font-bold"
                    >
                        Got it
                    </Button>
                    <button
                        onClick={handleDismiss}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full transition-colors"
                        aria-label="Dismiss"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
