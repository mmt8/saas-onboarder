"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MousePointer2, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTourStore } from "@/store/tour-store";
import { generateTourFromPage } from "@/lib/auto-tour-generator";

interface CreateTourDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateTourDialog({ isOpen, onClose }: CreateTourDialogProps) {
    const { startRecording, setSteps, setLanguage } = useTourStore();

    const handleModeSelect = (mode: 'manual' | 'auto') => {
        if (mode === 'manual') {
            startRecording('manual');
            onClose();
        } else if (mode === 'auto') {
            startRecording('auto');

            // Small delay to allow UI to settle/close dialog before scanning
            setTimeout(() => {
                const generatedSteps = generateTourFromPage();
                // Add IDs and order to generated steps
                const stepsWithIds = generatedSteps.map((step, index) => ({
                    ...step,
                    id: crypto.randomUUID(),
                    order: index
                }));
                setSteps(stepsWithIds);
            }, 500);

            onClose();
        }
    };

    const [hoveredButton, setHoveredButton] = useState<'manual' | 'auto' | null>(null);

    const getButtonStyle = (buttonId: 'manual' | 'auto') => ({
        border: hoveredButton === buttonId ? '1px solid #495BFD' : '1px solid #E2E8F0', // Primary color on hover
        transform: hoveredButton === buttonId ? 'translateY(-4px)' : 'none',
        boxShadow: hoveredButton === buttonId ? '0 12px 24px -8px rgba(0, 0, 0, 0.15)' : 'none',
        transition: 'all 0.2s ease-out'
    });

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
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden pointer-events-auto"
                    >
                        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
                            <h2 className="text-xl font-bold text-foreground">Create New Tour</h2>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onClose}
                                className="h-8 w-8 p-0 rounded-full hover:bg-slate-100 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => handleModeSelect('manual')}
                                onMouseEnter={() => setHoveredButton('manual')}
                                onMouseLeave={() => setHoveredButton(null)}
                                className="group relative p-6 rounded-xl bg-card text-left flex flex-col gap-4 cursor-pointer"
                                style={getButtonStyle('manual')}
                            >
                                <div className="p-3 rounded-lg bg-blue-500/10 w-fit group-hover:scale-110 transition-transform">
                                    <MousePointer2 className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground mb-1">Manual Builder</h3>
                                    <p className="text-xs text-muted-foreground">Build a tour by clicking elements yourself.</p>
                                </div>
                            </button>

                            <button
                                onClick={() => handleModeSelect('auto')}
                                onMouseEnter={() => setHoveredButton('auto')}
                                onMouseLeave={() => setHoveredButton(null)}
                                className="group relative p-6 rounded-xl bg-card text-left flex flex-col gap-4 cursor-pointer"
                                style={getButtonStyle('auto')}
                            >
                                <div className="p-3 rounded-lg bg-purple-500/10 w-fit group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground mb-1">Auto-Generate</h3>
                                    <p className="text-xs text-muted-foreground">AI scans your page and creates a guide automatically.</p>
                                </div>
                            </button>
                        </div>

                        <div className="px-6 pb-6 text-center">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">✨ Powered by Product Tour AI</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
