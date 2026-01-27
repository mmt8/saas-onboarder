"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MousePointer2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTourStore } from "@/store/tour-store";

interface CreateTourDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateTourDialog({ isOpen, onClose }: CreateTourDialogProps) {
    const { startRecording, isLoading } = useTourStore();

    const [tourName, setTourName] = useState("");
    const isNameValid = tourName.trim().length >= 3;

    const handleModeSelect = async (mode: 'manual') => {
        if (!isNameValid || isLoading) return;

        if (mode === 'manual') {
            startRecording('manual', tourName.trim());
            onClose();
        }
    };

    const [isHovered, setIsHovered] = useState(false);

    const getButtonStyle = () => ({
        border: isHovered ? '2px solid #ffffff' : '2px solid rgba(255,255,255,0.2)',
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
                                <button
                                    onClick={() => handleModeSelect('manual')}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    className="group relative p-8 rounded-xl bg-[#495BFD] text-white text-center flex flex-col items-center gap-4 cursor-pointer w-full transition-all hover:scale-[1.02] shadow-xl shadow-blue-500/20"
                                    style={getButtonStyle()}
                                >
                                    <div className="p-4 rounded-full bg-white/20 w-fit">
                                        <MousePointer2 className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">Start Recording</h3>
                                        <p className="text-sm opacity-90">Click elements on your page to build the tour.</p>
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
