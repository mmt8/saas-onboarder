"use client";

import { useEffect, useState } from "react";
import { useTourStore } from "@/store/tour-store";
import { Cursor } from "./Cursor";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export function TourPlayer() {
    const { currentTour, status, setStatus, tours, setTour, projects, currentProjectId } = useTourStore();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const searchParams = useSearchParams();

    // Auto-start tour from URL param
    useEffect(() => {
        const playTourId = searchParams.get('playTour');
        console.log("TourPlayer: Effect triggered", {
            playTourId,
            status,
            toursCount: tours.length,
            tours: tours.map(t => t.id)
        });

        if (playTourId && status === 'idle') {
            const tour = tours.find(t => t.id === playTourId);
            console.log("TourPlayer: Searching for tour...", { found: !!tour });

            if (tour) {
                // Check if we are on the correct page
                // Normalize paths (remove trailing slashes)
                const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
                const tourPath = (tour.pageUrl || '/').replace(/\/$/, '') || '/';

                if (currentPath !== tourPath) {
                    console.log(`TourPlayer: Wrong page (${currentPath}). Redirecting to ${tourPath}`);
                    // Use window.location.href to ensure full reload and hydration on target page
                    window.location.href = `${tourPath}?playTour=${tour.id}`;
                    return;
                }

                console.log("TourPlayer: Starting tour", tour.title);
                setTour(tour);
                setStatus('playing');
                // Clean up URL
                window.history.replaceState(null, '', window.location.pathname);
            } else {
                console.warn("TourPlayer: Tour not found for ID:", playTourId);
                // Maybe the store isn't hydrated yet?
            }
        }
    }, [searchParams, tours, status, setTour, setStatus]);

    useEffect(() => {
        if (status !== 'playing' || !currentTour) return;

        const step = currentTour.steps[currentStepIndex];
        if (!step) return;

        const updateTarget = () => {
            const element = document.querySelector(step.target);
            if (element) {
                const rect = element.getBoundingClientRect();
                setTargetRect(rect);
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Highlight effect
                element.classList.add('ring-4', 'ring-primary', 'ring-offset-4', 'transition-all', 'duration-500');
                return () => element.classList.remove('ring-4', 'ring-primary', 'ring-offset-4', 'transition-all', 'duration-500');
            }
        };

        // Initial update
        const cleanup = updateTarget();

        // Update on resize/scroll
        window.addEventListener('resize', updateTarget);
        window.addEventListener('scroll', updateTarget);

        return () => {
            cleanup?.();
            window.removeEventListener('resize', updateTarget);
            window.removeEventListener('scroll', updateTarget);
        };
    }, [currentTour, currentStepIndex, status]);

    if (status !== 'playing' || !currentTour || !targetRect) return null;

    const currentStep = currentTour.steps[currentStepIndex];
    const isLastStep = currentStepIndex === currentTour.steps.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            setStatus('idle');
            setCurrentStepIndex(0);
        } else {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const currentProject = projects.find(p => p.id === (currentTour?.project_id || currentProjectId));
    const theme = currentProject?.themeSettings;
    const isGlass = theme?.tooltipStyle === 'glass';

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50 z-[40] pointer-events-none transition-opacity duration-500" />

            {/* Cursor */}
            <Cursor
                x={targetRect.left + targetRect.width / 2}
                y={targetRect.top + targetRect.height / 2}
            />

            {/* Step Card */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={currentStep.id}
                className={cn(
                    "fixed z-[50] p-6 max-w-sm transition-all duration-300 overflow-hidden",
                    isGlass
                        ? "border border-white/5 text-white"
                        : theme?.tooltipStyle === 'color'
                            ? "border-none text-white shadow-xl"
                            : "bg-white dark:bg-gray-900 border border-white/10 text-gray-700 dark:text-gray-200 shadow-2xl"
                )}
                style={{
                    left: (() => {
                        const marginX = window.innerWidth * 0.01;
                        const tooltipWidth = 384; // max-w-sm
                        return Math.min(window.innerWidth - tooltipWidth - marginX, Math.max(marginX, targetRect.left));
                    })(),
                    top: (() => {
                        const marginY = window.innerHeight * 0.01;
                        const potentialTop = targetRect.bottom + 20 > window.innerHeight - 250
                            ? targetRect.top - 220
                            : targetRect.bottom + 20;
                        return Math.min(window.innerHeight - 250, Math.max(marginY, potentialTop));
                    })(),
                    borderRadius: `${theme?.borderRadius || '20'}px`,
                    ...(isGlass ? {
                        backgroundColor: 'rgba(15, 15, 15, 0.8)',
                        backdropFilter: 'blur(40px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                        boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    } : {
                        backgroundColor: theme?.tooltipStyle === 'color' ? theme.tooltipColor : undefined
                    })
                }}
            >
                <div className="flex items-start justify-end -mr-2 -mt-2 mb-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-6 w-6", isGlass ? "hover:bg-white/10 text-white" : "")}
                        onClick={() => setStatus('idle')}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <p className={cn("mb-4 leading-relaxed text-sm", (isGlass || theme?.tooltipStyle === 'color') ? "text-white" : "")}
                    style={{ lineHeight: isGlass ? '1.5' : 'inherit' }}>
                    {currentStep.content || "Click on this element to proceed."}
                </p>

                <div className="flex justify-end items-center gap-4 mt-3">
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest",
                        isGlass ? "text-white/40" : "text-gray-400"
                    )}>
                        {currentStepIndex + 1} of {currentTour.steps.length}
                    </span>
                    <Button
                        onClick={handleNext}
                        className={cn("group font-bold transition-all",
                            isGlass ? "bg-[rgba(0,0,0,0.08)] border border-white/10 text-white hover:bg-white/10 rounded-full py-2 px-6 h-auto text-xs" :
                                theme?.tooltipStyle === 'color' ? "bg-white/10 hover:bg-white/20 text-white border-white/10" : ""
                        )}
                        variant={(isGlass || theme?.tooltipStyle === 'color') ? "outline" : "default"}
                    >
                        {isLastStep ? 'Finish' : 'Next'}
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </motion.div>
        </>
    );
}
