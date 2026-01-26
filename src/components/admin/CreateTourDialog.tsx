"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MousePointer2, Sparkles, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTourStore } from "@/store/tour-store";

interface CreateTourDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateTourDialog({ isOpen, onClose }: CreateTourDialogProps) {
    const { startRecording, generateAISteps, isLoading } = useTourStore();

    const [tourName, setTourName] = useState("");
    const isNameValid = tourName.trim().length >= 3;

    const handleModeSelect = async (mode: 'manual' | 'auto') => {
        if (!isNameValid || isLoading) return;

        if (mode === 'manual') {
            startRecording('manual', tourName.trim());
            onClose();
        } else if (mode === 'auto') {
            startRecording('auto', tourName.trim());
            onClose();
            // Trigger AI generation in the background/state
            await generateAISteps();
        }
    };

    const [hoveredButton, setHoveredButton] = useState<'manual' | 'auto' | null>(null);

    const getButtonStyle = (buttonId: 'manual' | 'auto') => ({
        border: hoveredButton === buttonId ? '1px solid #495BFD' : '1px solid #E2E8F0',
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

                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Give your tour a name</label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={tourName}
                                    onChange={(e) => setTourName(e.target.value)}
                                    placeholder="Name your tour..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-[#495BFD] focus:ring-4 focus:ring-blue-500/5 transition-all"
                                />
                            </div>

                            <div className="pt-2">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Recording Mode</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            </div>
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
