"use client";

import { useState } from "react";

import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { X, GripVertical, Trash2, Loader2, Play, ArrowLeft, Code, Check, ChevronDown } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { Reorder, AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface StepEditorProps {
    isFloating?: boolean;
    onBack?: () => void;
    onSuccess?: (message: string) => void;
}

export function StepEditor({ isFloating = true, onBack, onSuccess }: StepEditorProps) {
    const {
        recordedSteps,
        updateStep,
        deleteStep,
        reorderSteps,
        isRecording,
        saveTour,
        stopRecording,
        isLoading,
        editingTourId,
        deleteTour,
        setTour,
        setStatus,
        tours,
        recordingTourTitle,
        updateTourBehavior
    } = useTourStore();
    const [tourTitle, setTourTitle] = useState(
        recordingTourTitle !== '' ? recordingTourTitle :
            (editingTourId ? (tours.find(t => t.id === editingTourId)?.title || "") : "")
    );
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [titleError, setTitleError] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [visibleSelectors, setVisibleSelectors] = useState<Record<string, boolean>>({});
    const [frequencyOpen, setFrequencyOpen] = useState(false);

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
            <div className="px-5 pb-2 pt-4 space-y-5">
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

                            <Button
                                size="sm"
                                onClick={() => {
                                    if (tourTitle.trim().length < 3) {
                                        setTitleError(true);
                                        return;
                                    }
                                    setTitleError(false);
                                    saveTour(tourTitle, window.location.pathname);
                                }}
                                disabled={isLoading}
                                className="h-8 px-4 text-xs shadow-blue-500/20 transition-all active:scale-95 bg-[#495BFD] text-white hover:bg-[#3749d0] rounded-xl font-medium"
                            >
                                {isLoading ? "Saving..." : "Save Tour"}
                            </Button>
                        </div>
                    </div>
                </div>

            </div>


            {isEditingExistingTour && (
                <div className="px-4 flex gap-2 items-center mt-2">
                    {/* Delivery Control - Takes remaining space */}
                    <div className="relative flex-1 min-w-0">
                        <button
                            onClick={() => setFrequencyOpen(!frequencyOpen)}
                            className="w-full flex items-center justify-between bg-white border-solid border border-slate-300 hover:border-blue-400/50 rounded-lg px-3 h-9 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
                        >
                            <div className="flex items-center gap-2 truncate">
                                {/* <Play className="w-3 h-3 text-[#E65221] shrink-0" /> */}
                                <span className="truncate">
                                    {currentTour?.playBehavior === 'weekly' ? 'Weekly (2x max)' :
                                        currentTour?.playBehavior === 'monthly_thrice' ? 'Monthly (3x max)' :
                                            'Show once'}
                                </span>
                            </div>
                            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-2 mr-1" />
                        </button>

                        {/* Dropdown Menu */}
                        {frequencyOpen && (
                            <div
                                className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-100 z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                            >
                                <div className="p-1">
                                    {[
                                        { value: 'first_time', label: 'Show once' },
                                        { value: 'weekly', label: 'Weekly (2x max)' },
                                        { value: 'monthly_thrice', label: 'Monthly (3x max)' }
                                    ].map((item) => (
                                        <div
                                            key={item.value}
                                            onClick={() => {
                                                if (currentTour) {
                                                    updateTourBehavior(currentTour.id, item.value as any);
                                                    setFrequencyOpen(false);
                                                }
                                            }}
                                            className="relative flex items-center h-8 px-8 text-sm font-bold text-slate-600 rounded-md select-none hover:bg-slate-50 hover:text-[#495BFD] cursor-pointer transition-colors"
                                        >
                                            <span className="flex-1">{item.label}</span>
                                            {currentTour?.playBehavior === item.value && (
                                                <div className="absolute left-2 flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-[#495BFD]" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons - Icon Only */}
                    <div className="flex gap-2 shrink-0">
                        <Button
                            size="icon"
                            onClick={handlePlayback}
                            className="bg-white border-solid border border-slate-200 h-9 w-9 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors shadow-sm p-0 flex items-center justify-center"
                            title="Playback"
                        >
                            <Play className="w-4 h-4 fill-current" />
                        </Button>
                        <Button
                            size="icon"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-white border-solid border border-rose-100 h-9 w-9 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors shadow-sm p-0 flex items-center justify-center"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            <div className="space-y-1.5 px-5 mt-2">
                <label className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1 ml-1">
                    Tour Title
                    <span className="text-destructive font-bold">*</span>
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={tourTitle}
                        onChange={(e) => {
                            setTourTitle(e.target.value);
                            if (e.target.value.trim().length >= 3) setTitleError(false);
                        }}
                        className={cn(
                            "w-full bg-white border-solid border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 outline-none transition-all shadow-sm placeholder:text-slate-400 placeholder:font-medium",
                            titleError
                                ? "border-red-500 focus:border-red-500 ring-1 ring-red-500/10"
                                : "focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                        )}
                        placeholder="Name your tour..."
                    />
                    {titleError && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 animate-in slide-in-from-top-1 fading-in duration-200 mt-1.5 ml-1">
                            <span className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                            Please name your tour (min 3 chars)
                        </div>
                    )}
                </div>
            </div>
            <div className="text-xs text-muted-foreground flex justify-between px-5 mt-2">
                <span className="ml-1">Steps: {recordedSteps.length}</span>
            </div>

            {/* Delete Confirmation Dialog */}
            {
                showDeleteConfirm && (
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
                )
            }

            <div className="flex-1 overflow-y-auto pl-5 pr-1 py-2 space-y-1.5 [scrollbar-gutter:stable]">
                <Reorder.Group axis="y" values={recordedSteps} onReorder={reorderSteps} className="space-y-1.5">
                    <AnimatePresence initial={false}>
                        {recordedSteps.map((step, index) => (
                            <Reorder.Item
                                key={step.id}
                                value={step}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="group relative bg-white rounded-xl p-1.5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:z-10 transition-all cursor-grab active:cursor-grabbing"
                                style={{
                                    border: '1px solid #CBD5E1'
                                }}
                            >
                                <div className="space-y-1">
                                    {/* Top Row: Meta & Actions */}
                                    <div className="flex items-center justify-between gap-1.5">
                                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                            <div className="text-slate-400 hover:text-[#495BFD] transition-colors cursor-grab active:cursor-grabbing">
                                                <GripVertical className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="shrink-0 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0 rounded-full uppercase tracking-wider leading-relaxed">
                                                {index + 1}
                                            </span>
                                            <span className="text-xs font-bold text-slate-700 truncate pt-0.5">
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

                                    {/* Bottom Row: Input - Styled with background/border */}
                                    <div className="relative group/input bg-slate-50 border-solid border border-slate-200 rounded-lg p-1.5">
                                        <textarea
                                            value={step.content}
                                            onChange={(e) => updateStep(step.id, { content: e.target.value })}
                                            onPointerDown={(e) => e.stopPropagation()}
                                            onPointerDownCapture={(e) => e.stopPropagation()}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onMouseDownCapture={(e) => e.stopPropagation()}
                                            className="w-full bg-transparent border-none text-sm text-foreground focus:outline-none focus:ring-0 resize-none placeholder:text-muted-foreground/50 p-0 leading-relaxed"
                                            rows={3}
                                            placeholder="What should the user do?"
                                        />
                                    </div>

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
        </div >
    );

    return isFloating ? content : (
        <div className="h-full w-full flex flex-col overflow-hidden">
            {content}
        </div>
    );
}
