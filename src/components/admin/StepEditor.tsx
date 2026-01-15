"use client";

import { useState } from "react";

import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { X, GripVertical, Trash2, Loader2, Play } from "lucide-react";
import { Reorder, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function StepEditor() {
    const { recordedSteps, updateStep, deleteStep, reorderSteps, isRecording, saveTour, stopRecording, isLoading, editingTourId, deleteTour, setTour, setStatus, tours } = useTourStore();
    const [tourTitle, setTourTitle] = useState("New Tour");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    if (!isRecording) return null;

    const isEditingExistingTour = !!editingTourId;
    const currentTour = tours.find(t => t.id === editingTourId);

    const handlePlayback = () => {
        if (currentTour) {
            setTour(currentTour);
            setStatus('playing');
        }
    };

    const handleDelete = async () => {
        if (editingTourId) {
            await deleteTour(editingTourId);
            stopRecording();
        }
    };

    return (
        <div className="fixed top-20 right-6 w-80 max-h-[calc(100vh-8rem)] flex flex-col glass rounded-2xl shadow-2xl overflow-hidden admin-toolbar-ignore z-40">
            <div className="p-4 border-b border-border/50 bg-white/50 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-foreground">
                        {isEditingExistingTour ? 'Edit Tour' : 'Recorded Steps'}
                    </h3>
                    <div className="flex items-center gap-2">
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={stopRecording}
                            disabled={isLoading}
                            className="h-7 w-7 p-0 rounded-full hover:bg-red-50 hover:text-red-500"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => saveTour(tourTitle, window.location.pathname)}
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground h-7 text-xs rounded-full shadow-sm"
                        >
                            {isLoading ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>

                {isEditingExistingTour && (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handlePlayback}
                            className="flex-1 h-8 text-xs gap-1"
                        >
                            <Play className="w-3 h-3" />
                            Playback
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex-1 h-8 text-xs gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="w-3 h-3" />
                            Delete
                        </Button>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Tour Title</label>
                    <input
                        type="text"
                        value={tourTitle}
                        onChange={(e) => setTourTitle(e.target.value)}
                        className="w-full bg-white/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
                        placeholder="Enter tour title..."
                    />
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                    <span>Steps: {recordedSteps.length}</span>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-2xl">
                    <div className="bg-white rounded-xl p-6 m-4 max-w-sm shadow-2xl">
                        <h4 className="font-bold text-lg mb-2">Delete Tour?</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                            This action cannot be undone. The tour will be permanently deleted.
                        </p>
                        <div className="flex gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleDelete}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white/30">
                <Reorder.Group axis="y" values={recordedSteps} onReorder={reorderSteps} className="space-y-3">
                    <AnimatePresence initial={false}>
                        {recordedSteps.map((step, index) => (
                            <Reorder.Item
                                key={step.id}
                                value={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="group relative bg-white border border-border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 text-muted-foreground/50 cursor-grab active:cursor-grabbing hover:text-primary transition-colors">
                                        <GripVertical className="w-4 h-4" />
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase tracking-wider">
                                                Step {index + 1}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all rounded-full"
                                                onClick={() => deleteStep(step.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>

                                        <textarea
                                            value={step.content}
                                            onChange={(e) => updateStep(step.id, { content: e.target.value })}
                                            className="w-full bg-transparent text-sm text-foreground focus:outline-none resize-none placeholder:text-muted-foreground/50"
                                            rows={2}
                                            placeholder="Click on this element to proceed."
                                        />

                                        <div className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px] bg-slate-100 px-1.5 py-0.5 rounded">
                                            {step.target}
                                        </div>
                                    </div>
                                </div>
                            </Reorder.Item>
                        ))}
                    </AnimatePresence>
                </Reorder.Group>

                {recordedSteps.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground text-sm flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                            <GripVertical className="w-6 h-6 text-slate-300" />
                        </div>
                        <p>Click elements on the page to record steps.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
