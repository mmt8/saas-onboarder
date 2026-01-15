"use client";

import { useEffect } from "react";
import { useTourStore } from "@/store/tour-store";
import { Toaster } from "sonner";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { checkAuth } = useTourStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <>
            <Toaster position="top-center" />
            {children}
        </>
    );
}
