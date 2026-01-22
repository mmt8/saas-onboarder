
import React, { useEffect, useState } from "react";
import { useTourStore } from "@/store/tour-store";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function WidgetTourPlayer() {
    const { currentTour, status, setStatus, tours, setTour, projects, currentProjectId, pingProject } = useTourStore();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    // Find the project for theme settings
    const projectIdForTheme = currentTour?.project_id || currentProjectId;
    const currentProject = projects.find(p => p.id === projectIdForTheme);

    useEffect(() => {
        console.log('WidgetTourPlayer: Theme Lookup', {
            tourProjectId: currentTour?.project_id,
            storeProjectId: currentProjectId,
            resolvedProjectId: projectIdForTheme,
            projectFound: !!currentProject,
            themeSettings: currentProject?.themeSettings
        });
    }, [currentTour, currentProjectId, projects, currentProject]);

    const theme = currentProject?.themeSettings || {
        fontFamily: 'Inter, sans-serif',
        darkMode: false,
        primaryColor: '#495BFD',
        borderRadius: '12',
        paddingV: '10',
        paddingH: '20',
        tooltipStyle: 'solid' as const,
        tooltipColor: '#495BFD'
    };

    // Auto-start tour from URL param
    // ... (rest of the effects remain the same)
    useEffect(() => {
        // Native URLSearchParams for Widget
        const params = new URLSearchParams(window.location.search);
        const playTourId = params.get('playTour');

        if (playTourId && status === 'idle') {
            const tour = tours.find(t => t.id === playTourId);
            if (tour) {
                const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
                const tourPath = (tour.pageUrl || '/').replace(/\/$/, '') || '/';

                if (currentPath !== tourPath) {
                    window.location.href = `${tourPath}?playTour=${tour.id}`;
                    return;
                }

                setTour(tour);
                setStatus('playing');
                window.history.replaceState(null, '', window.location.pathname);
            }
        }
    }, [tours, status, setTour, setStatus]);

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
            } else {
                setTargetRect(new DOMRect(window.innerWidth / 2 - 100, window.innerHeight / 2 - 50, 200, 100));
            }
        };

        updateTarget();
        window.addEventListener('resize', updateTarget);
        window.addEventListener('scroll', updateTarget);

        return () => {
            window.removeEventListener('resize', updateTarget);
            window.removeEventListener('scroll', updateTarget);
        };
    }, [currentTour, currentStepIndex, status]);

    if (status !== 'playing' || !currentTour || !targetRect) {
        return null;
    }

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

    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="contents pointer-events-auto" style={{ fontFamily: theme.fontFamily }}>
            {/* Spotlight Overlay */}
            <svg
                className="fixed inset-0 z-[2147483640] pointer-events-none"
                style={{ width: '100vw', height: '100vh' }}
            >
                <defs>
                    <mask id="spotlight-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        <rect
                            x={targetRect.left - 4}
                            y={targetRect.top - 4}
                            width={targetRect.width + 8}
                            height={targetRect.height + 8}
                            rx="8"
                            fill="black"
                        />
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="rgba(0,0,0,0.6)"
                    mask="url(#spotlight-mask)"
                    className="transition-all duration-500"
                />
            </svg>

            {/* Blinking/Pulsing Highlight Border */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.02, 1],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="fixed z-[2147483641] pointer-events-none border-2 rounded-lg"
                style={{
                    left: targetRect.left - 6,
                    top: targetRect.top - 6,
                    width: targetRect.width + 12,
                    height: targetRect.height + 12,
                    borderColor: theme.primaryColor,
                    boxShadow: `0 0 15px ${theme.primaryColor}80`
                }}
            />

            {/* Step Card */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={currentStep.id}
                className={cn(
                    "fixed z-[2147483649] p-6 rounded-2xl shadow-2xl border max-w-sm",
                    theme.tooltipStyle === 'glass'
                        ? (theme.darkMode ? "bg-white/40 backdrop-blur-md border-white/20 text-slate-900" : "bg-[#282828]/20 backdrop-blur-md border-white/20 text-white shadow-[0_15px_24.5px_rgba(0,0,0,0.24),0_7px_10.5px_rgba(0,0,0,0.15)]")
                        : (theme.darkMode ? "bg-[#1e293b] border-slate-700 text-white" : "bg-white border-slate-100 text-slate-900")
                )}
                style={{
                    left: Math.min(window.innerWidth - 360, Math.max(20, targetRect.left)),
                    top: targetRect.bottom + 40 > window.innerHeight - 200
                        ? targetRect.top - 220
                        : targetRect.bottom + 20,
                    ...(theme.tooltipStyle === 'color' ? { backgroundColor: theme.tooltipColor, color: 'white', border: 'none' } : {}),
                    ...(theme.tooltipStyle === 'glass' && !theme.darkMode ? { textShadow: '0 1px 2px rgba(0,0,0,0.4)' } : {})
                }}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span
                            className="flex items-center justify-center w-6 h-6 rounded-full text-white text-[10px] font-bold"
                            style={{ backgroundColor: theme.tooltipStyle === 'solid' ? theme.primaryColor : 'rgba(0,0,0,0.15)' }}
                        >
                            {currentStepIndex + 1}
                        </span>
                        <span className={cn("text-xs font-medium",
                            theme.tooltipStyle === 'solid' ? (theme.darkMode ? "text-slate-400" : "text-gray-400") : (theme.darkMode && theme.tooltipStyle === 'glass' ? "text-slate-500" : "text-white/60")
                        )}>
                            of {currentTour.steps.length}
                        </span>
                    </div>
                    <button
                        className={cn(
                            "h-6 w-6 -mr-2 -mt-2 rounded-full flex items-center justify-center transition-colors",
                            (theme.darkMode || (theme.tooltipStyle === 'glass' && theme.darkMode)) ? "hover:bg-black/5" : "hover:bg-white/10"
                        )}
                        onClick={() => setStatus('idle')}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <p className={cn("mb-6 leading-relaxed text-sm",
                    theme.tooltipStyle === 'solid' ? (theme.darkMode ? "text-slate-200" : "text-gray-700") : (theme.darkMode && theme.tooltipStyle === 'glass' ? "text-slate-800" : "text-white")
                )}>
                    {currentStep.content || "Click on this element to proceed."}
                </p>

                <div className="flex justify-end">
                    <button
                        onClick={handleNext}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={cn(
                            "group flex items-center justify-center font-bold transition-all text-sm outline-none hover:brightness-90 active:brightness-75 active:scale-[0.95] active:shadow-none",
                            theme.tooltipStyle === 'solid' ? "shadow-sm" : ""
                        )}
                        style={{
                            backgroundColor: theme.tooltipStyle === 'solid' ? theme.primaryColor :
                                (theme.tooltipStyle === 'glass' && theme.darkMode ?
                                    (isHovered ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)') :
                                    (isHovered ? 'rgba(0,0,0,0.13)' : 'rgba(0,0,0,0.1)')),
                            color: (theme.darkMode && theme.tooltipStyle === 'glass') ? '#1e293b' : 'white',
                            borderRadius: `${theme.borderRadius}px`,
                            padding: `${theme.paddingV}px ${theme.paddingH}px`,
                            fontSize: '0.9rem'
                        }}
                    >
                        {isLastStep ? 'Finish' : 'Next'}
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
