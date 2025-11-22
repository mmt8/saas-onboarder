"use client";

import { useEffect, useState } from "react";
import { useTourStore } from "@/store/tour-store";
import { Cursor } from "./Cursor";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

export function TourPlayer() {
    const { currentTour, status, setStatus, tours, setTour } = useTourStore();
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
                className="fixed z-[50] bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl border border-white/10 max-w-sm"
                style={{
                    left: Math.min(window.innerWidth - 340, Math.max(20, targetRect.left)),
                    top: targetRect.bottom + 20 > window.innerHeight - 200
                        ? targetRect.top - 200
                        : targetRect.bottom + 20
                }}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-bold">
                            {currentStepIndex + 1}
                        </span>
                        <span className="text-xs text-gray-400">of {currentTour.steps.length}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 -mr-2 -mt-2"
                        onClick={() => setStatus('idle')}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <p className="text-gray-700 dark:text-gray-200 mb-6 leading-relaxed">
                    {currentStep.content || "Click on this element to proceed."}
                </p>

                <div className="flex justify-end">
                    <Button onClick={handleNext} className="group">
                        {isLastStep ? 'Finish' : 'Next'}
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </motion.div>
        </>
    );
}
