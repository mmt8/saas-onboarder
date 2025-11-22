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

    const handleModeSelect = (mode: 'manual' | 'auto' | 'voice') => {
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
        } else {
            // Placeholder for voice mode
            console.log(`Selected mode: ${mode}`);
            startRecording(mode);
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
                            <h2 className="text-xl font-bold text-foreground">Create New Tour</h2>
                            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-secondary">
                                <X className="w-5 h-5 text-muted-foreground" />
                            </Button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={() => handleModeSelect('manual')}
                                className="group relative p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-left flex flex-col gap-4"
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
                                className="group relative p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-left flex flex-col gap-4"
                            >
                                <div className="p-3 rounded-lg bg-purple-500/10 w-fit group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground mb-1">Auto-Generate</h3>
                                    <p className="text-xs text-muted-foreground">AI scans your page and creates a guide automatically.</p>
                                </div>
                            </button>

                            <button
                                onClick={() => handleModeSelect('voice')}
                                className="group relative p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-left flex flex-col gap-4"
                            >
                                <div className="p-3 rounded-lg bg-green-500/10 w-fit group-hover:scale-110 transition-transform">
                                    <Mic className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground mb-1">Voice Assisted</h3>
                                    <p className="text-xs text-muted-foreground">Narrate and click to build your tour naturally.</p>
                                </div>
                            </button>
                        </div>

                        <div className="px-6 pb-6">
                            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2 block">Voice Language</label>
                            <select
                                className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                                onChange={(e) => setLanguage(e.target.value)}
                                defaultValue="en-US"
                            >
                                <option value="en-US">English (US)</option>
                                <option value="en-GB">English (UK)</option>
                                <option value="es-ES">Spanish</option>
                                <option value="fr-FR">French</option>
                                <option value="de-DE">German</option>
                                <option value="tr-TR">Turkish</option>
                                <option value="ja-JP">Japanese</option>
                            </select>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
