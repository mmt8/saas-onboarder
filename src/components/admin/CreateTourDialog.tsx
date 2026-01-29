"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MousePointer2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTourStore } from "@/store/tour-store";
import { cn } from "@/lib/utils";

interface CreateTourDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateTourDialog({ isOpen, onClose }: CreateTourDialogProps) {
    const { startRecording, isLoading } = useTourStore();

    const [tourName, setTourName] = useState("");
    const [showError, setShowError] = useState(false);

    const isNameValid = tourName.trim().length >= 3;

    const handleModeSelect = async (mode: 'manual' | 'auto') => {
        if (!isNameValid) {
            setShowError(true);
            return;
        }

        if (isLoading) return;

        startRecording(mode, tourName.trim());
        onClose();
    };

    const [hoveredMode, setHoveredMode] = useState<'manual' | 'auto' | null>(null);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 pointer-events-auto"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-card border border-border rounded-[2.5rem] shadow-2xl z-50 overflow-hidden pointer-events-auto font-sans"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-border flex items-center justify-between bg-secondary/20">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-foreground">Create New Tour</h2>
                                <p className="text-sm text-muted-foreground">Choose how you want to build your guide.</p>
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onClose}
                                className="h-10 w-10 p-0 rounded-full hover:bg-black/5 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Name Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground uppercase tracking-wider block">Tour Name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={tourName}
                                    onChange={(e) => {
                                        setTourName(e.target.value);
                                        if (e.target.value.trim().length >= 3) setShowError(false);
                                    }}
                                    placeholder="e.g. Dashboard Onboarding"
                                    className={cn(
                                        "w-full bg-slate-50 border-2 rounded-2xl px-5 py-4 text-foreground text-lg focus:outline-none transition-all",
                                        showError && !isNameValid
                                            ? "border-red-500 ring-4 ring-red-500/10"
                                            : "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                                    )}
                                />
                                <AnimatePresence>
                                    {showError && !isNameValid && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="text-xs font-semibold text-red-500 flex items-center gap-1 mt-1.5"
                                        >
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            <span>Minimum 3 characters required</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mode Selection Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                                {/* Manual Mode */}
                                <button
                                    onClick={() => handleModeSelect('manual')}
                                    onMouseEnter={() => setHoveredMode('manual')}
                                    onMouseLeave={() => setHoveredMode(null)}
                                    className={cn(
                                        "group relative p-8 rounded-[2rem] border-2 flex flex-col items-center gap-6 cursor-pointer transition-all duration-300",
                                        hoveredMode === 'manual'
                                            ? "bg-[#495BFD] border-[#495BFD] text-white scale-[1.02] shadow-xl shadow-blue-500/20"
                                            : "bg-background border-border hover:border-primary/30 text-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "p-5 rounded-2xl transition-colors duration-300",
                                        hoveredMode === 'manual' ? "bg-white/20" : "bg-primary/10"
                                    )}>
                                        <MousePointer2 className={cn("w-10 h-10", hoveredMode === 'manual' ? "text-white" : "text-primary")} />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold mb-2">Manual Recording</h3>
                                        <p className={cn(
                                            "text-sm leading-relaxed",
                                            hoveredMode === 'manual' ? "text-white/80" : "text-muted-foreground"
                                        )}>
                                            Click elements one by one to build your custom flow.
                                        </p>
                                    </div>
                                </button>

                                {/* AI Auto-generate Mode */}
                                <button
                                    onClick={() => handleModeSelect('auto')}
                                    onMouseEnter={() => setHoveredMode('auto')}
                                    onMouseLeave={() => setHoveredMode(null)}
                                    className={cn(
                                        "group relative p-8 rounded-[2rem] border-2 flex flex-col items-center gap-6 cursor-pointer transition-all duration-300",
                                        hoveredMode === 'auto'
                                            ? "bg-[#E65221] border-[#E65221] text-white scale-[1.02] shadow-xl shadow-orange-500/20"
                                            : "bg-background border-border hover:border-[#E65221]/30 text-foreground"
                                    )}
                                >
                                    <div className={cn(
                                        "p-5 rounded-2xl transition-colors duration-300",
                                        hoveredMode === 'auto' ? "bg-white/20" : "bg-orange-500/10"
                                    )}>
                                        <Sparkles className={cn("w-10 h-10", hoveredMode === 'auto' ? "text-white" : "text-[#E65221]")} />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold mb-2">AI Auto-generate</h3>
                                        <p className={cn(
                                            "text-sm leading-relaxed",
                                            hoveredMode === 'auto' ? "text-white/80" : "text-muted-foreground"
                                        )}>
                                            The AI watches you use the app and builds the tour for you.
                                        </p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
