"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteTourDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    tourTitle: string;
}

export function DeleteTourDialog({ isOpen, onClose, onConfirm, tourTitle }: DeleteTourDialogProps) {
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
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
                            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Delete Tour
                            </h2>
                            <Button variant="ghost" size="icon" onClick={onClose}>
                                <X className="w-5 h-5 text-muted-foreground" />
                            </Button>
                        </div>

                        <div className="p-6">
                            <p className="text-muted-foreground mb-6">
                                Are you sure you want to delete <span className="font-bold text-foreground">"{tourTitle}"</span>? This action cannot be undone.
                            </p>

                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={onClose}>
                                    No, Keep
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={async () => {
                                        await onConfirm();
                                        onClose();
                                    }}
                                >
                                    Yes, Delete
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
