"use client";

import { useState } from "react";

import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { X, GripVertical, Trash2, Loader2, Play, ArrowLeft, Code } from "lucide-react";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface StepEditorProps {
    isFloating?: boolean;
    onBack?: () => void;
    onSuccess?: (message: string) => void;
}

export function StepEditor({ isFloating = true, onBack, onSuccess }: StepEditorProps) {
    const { recordedSteps, updateStep, deleteStep, reorderSteps, isRecording, saveTour, stopRecording, isLoading, editingTourId, deleteTour, setTour, setStatus, tours, recordingTourTitle } = useTourStore();
    const [tourTitle, setTourTitle] = useState(
        recordingTourTitle !== '' ? recordingTourTitle :
            (editingTourId ? (tours.find(t => t.id === editingTourId)?.title || "") : "")
    );
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [visibleSelectors, setVisibleSelectors] = useState<Record<string, boolean>>({});

    if (!isRecording) return null;

    const toggleSelector = (id: string) => {
        setVisibleSelectors(prev => ({ ...prev, [id]: !prev[id] }));
    };

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
            const msg = "Tour deleted successfully";
            toast.success(msg, { duration: 3000 });
            if (onSuccess) onSuccess(msg);
            if (onBack) {
                onBack();
            } else {
                stopRecording();
            }
        }
    };

    const content = (
        <div className={cn(
            "flex flex-col overflow-hidden",
            isFloating ? "fixed top-24 right-6 w-80 max-h-[calc(100vh-10rem)] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200/60 admin-toolbar-ignore z-40" : "h-full w-full"
        )}>
            <div className="p-6 pb-2 space-y-5">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold text-foreground">
                        {isEditingExistingTour ? 'Edit Tour' : 'Recorded Steps'}
                    </h3>
                    <div className="flex items-center gap-2">
                        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                        {onBack && (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onBack}
                                disabled={isLoading}
                                className="h-8 w-8 p-0"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        )}
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={stopRecording}
                            disabled={isLoading}
                            className="h-8 w-8 p-0"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            {titleError && (
                                <span className="text-[10px] text-destructive font-bold uppercase tracking-tight whitespace-nowrap animate-pulse">
                                    please give a name
                                </span>
                            )}
                            <Button
                                size="sm"
                                onClick={() => {
                                    if (tourTitle.trim().length < 3) {
                                        setTitleError(true);
                                        toast.error("Please give your tour a name (min 3 chars)");
                                        return;
                                    }
                                    setTitleError(false);
                                    saveTour(tourTitle, window.location.pathname);
                                }}
                                disabled={isLoading}
                                className={cn(
                                    "h-8 px-4 text-xs shadow-blue-500/20 transition-all active:scale-95",
                                    titleError && "bg-destructive hover:bg-destructive/90 shadow-destructive/20"
                                )}
                            >
                                {isLoading ? "Saving..." : "Save Tour"}
                            </Button>
                        </div>
                    </div>
                </div>

                {isEditingExistingTour && (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={handlePlayback}
                            className="flex-1 h-9 text-xs gap-2 rounded-xl border-none"
                        >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Playback
                        </Button>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="flex-1 h-9 text-xs gap-2 rounded-xl border-none"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                        </Button>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-xs text-muted-foreground font-medium uppercase tracking-wide flex items-center gap-1">
                        Tour Title
                        <span className="text-destructive font-bold">*</span>
                    </label>
                    <input
                        type="text"
                        value={tourTitle}
                        onChange={(e) => {
                            setTourTitle(e.target.value);
                            if (e.target.value.trim().length >= 3) setTitleError(false);
                        }}
                        className={cn(
                            "w-full bg-slate-100 border rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none transition-all",
                            titleError ? "border-destructive ring-4 ring-destructive/10" :
                                (tourTitle.trim().length < 3 && tourTitle.length > 0 ? "border-amber-200 focus:border-amber-400 focus:ring-amber-500/5" : "border-slate-200 focus:border-[#495BFD] focus:ring-blue-500/5")
                        )}
                        placeholder="Name your tour..."
                    />
                    {titleError && (
                        <p className="text-[10px] text-destructive font-bold uppercase tracking-wider ml-1">Title is required</p>
                    )}
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
                                variant="destructive"
                                onClick={handleDelete}
                                className="flex-1"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 pt-2 space-y-3">
                <Reorder.Group axis="y" values={recordedSteps} onReorder={reorderSteps} className="space-y-3">
                    <AnimatePresence initial={false}>
                        {recordedSteps.map((step, index) => (
                            <Reorder.Item
                                key={step.id}
                                value={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="group relative bg-white rounded-xl p-2.5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg hover:scale-[1.01] hover:z-10 transition-all cursor-grab active:cursor-grabbing"
                                style={{
                                    border: '1px solid #CBD5E1'
                                }}
                            >
                                <div className="space-y-2">
                                    {/* Top Row: Meta & Actions */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <div className="text-slate-400 hover:text-[#495BFD] transition-colors cursor-grab active:cursor-grabbing">
                                                <GripVertical className="w-4 h-4" />
                                            </div>
                                            <span className="shrink-0 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                {index + 1}
                                            </span>
                                            <span className="text-sm font-semibold text-slate-700 truncate">
                                                {step.target.split(' ').pop()?.replace(/[.#\[\]]/g, ' ') || 'Element'}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className={cn(
                                                    "h-7 w-7 transition-colors",
                                                    visibleSelectors[step.id] && "bg-blue-50 text-blue-600"
                                                )}
                                                onClick={(e) => { e.stopPropagation(); toggleSelector(step.id); }}
                                            >
                                                <Code className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-7 text-muted-foreground"
                                                onClick={(e) => { e.stopPropagation(); deleteStep(step.id); }}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Bottom Row: Input */}
                                    <textarea
                                        value={step.content}
                                        onChange={(e) => updateStep(step.id, { content: e.target.value })}
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onPointerDownCapture={(e) => e.stopPropagation()}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onMouseDownCapture={(e) => e.stopPropagation()}
                                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[#495BFD] focus:ring-4 focus:ring-blue-500/5 transition-all resize-none placeholder:text-muted-foreground/50"
                                        rows={2}
                                        placeholder="What should the user do?"
                                    />

                                    {/* Expandable Selector View */}
                                    <AnimatePresence>
                                        {visibleSelectors[step.id] && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                animate={{ height: 'auto', opacity: 1, marginTop: 4 }}
                                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                                className="overflow-hidden"
                                            >
                                                <div className="space-y-1 font-mono text-[10px] bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-800 shadow-inner">
                                                    <div className="flex gap-2">
                                                        <span className="text-slate-500 shrink-0">Label:</span>
                                                        <span className="text-blue-400 truncate">{step.target.split(' ').pop()?.replace(/[.#\[\]]/g, ' ') || 'Element'}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <span className="text-slate-500 shrink-0">Selector:</span>
                                                        <span className="text-emerald-400 break-all">{step.target}</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
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

    return isFloating ? content : (
        <div className="h-full w-full flex flex-col overflow-hidden">
            {content}
        </div>
    );
}
