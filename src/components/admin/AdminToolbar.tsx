"use client";

import { useTourStore } from "@/store/tour-store";
import { cn } from "@/lib/utils";

export function AdminToolbar() {
    const { isRecording, creationMode, recordedSteps } = useTourStore();

    if (!isRecording && recordedSteps.length === 0) {
        return null;
    }

    // For manual mode, we don't show the bottom toolbar anymore as controls are in the side panel
    if (creationMode === 'manual') {
        return null;
    }

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50 w-full max-w-2xl pointer-events-none">
            {/* Main Toolbar */}
            {isRecording && (
                <div className="glass rounded-full p-2 flex items-center gap-2 shadow-2xl pointer-events-auto transition-all hover:scale-[1.02] bg-white/80">
                    <div className="flex items-center gap-3 px-4">
                        <div className={cn(
                            "w-3 h-3 rounded-full transition-colors duration-300",
                            "bg-red-500 animate-pulse"
                        )} />
                        <span className="text-sm font-semibold text-foreground">
                            Recording...
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
