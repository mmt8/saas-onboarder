import React, { useEffect, useState } from "react";
import { useTourStore } from "@/store/tour-store";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { detectBranding, DetectedBranding } from "./utils/branding-detector";

export function WidgetTourPlayer() {
    const { currentTour, status, setStatus, tours, setTour, projects, currentProjectId, pingProject } = useTourStore();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    // Initialize with centered rect to ensure we don't return null and keep the player visible
    const [targetRect, setTargetRect] = useState<DOMRect>(new DOMRect(window.innerWidth / 2 - 100, 100, 200, 100));
    const [detectedBranding, setDetectedBranding] = useState<DetectedBranding | null>(null);

    // Find the project for theme settings
    const projectIdForTheme = currentTour?.project_id || currentProjectId;
    const currentProject = projects.find(p => p.id === projectIdForTheme);


    useEffect(() => {
        console.log('WidgetTourPlayer: Theme Lookup', {
            tourProjectId: currentTour?.project_id,
            storeProjectId: currentProjectId,
            resolvedProjectId: projectIdForTheme,
            projectFound: !!currentProject,
            themeSettings: currentProject?.themeSettings,
            detectedBranding
        });
    }, [currentTour, currentProjectId, projects, currentProject, detectedBranding]);

    const theme = {
        fontFamily: currentProject?.themeSettings?.fontFamily ?? 'Inter, sans-serif',
        darkMode: currentProject?.themeSettings?.darkMode ?? false,
        primaryColor: currentProject?.themeSettings?.primaryColor ?? '#E65221',
        borderRadius: currentProject?.themeSettings?.borderRadius ?? '20',
        paddingV: currentProject?.themeSettings?.paddingV ?? '10',
        paddingH: currentProject?.themeSettings?.paddingH ?? '20',
        tooltipStyle: currentProject?.themeSettings?.tooltipStyle ?? ('solid' as const),
        tooltipColor: currentProject?.themeSettings?.tooltipColor ?? '#E65221',
        textColor: 'white'
    };

    // Update auto-branding on mount or style change
    useEffect(() => {
        if (theme.tooltipStyle === 'auto') {
            const branding = detectBranding();
            if (branding) {
                setDetectedBranding(branding);
            }
        }
    }, [theme.tooltipStyle]);

    // Merge auto-detected values into the functional theme
    const activeTheme = {
        ...theme,
        primaryColor: theme.tooltipStyle === 'auto' && detectedBranding ? detectedBranding.primaryColor : (theme.tooltipStyle === 'auto' ? '#495BFD' : theme.primaryColor),
        fontFamily: theme.tooltipStyle === 'auto' && detectedBranding ? detectedBranding.fontFamily : theme.fontFamily,
        borderRadius: theme.tooltipStyle === 'auto' && detectedBranding ? detectedBranding.borderRadius : theme.borderRadius,
        tooltipColor: theme.tooltipStyle === 'auto' && detectedBranding ? detectedBranding.primaryColor : (theme.tooltipStyle === 'auto' ? '#495BFD' : theme.tooltipColor),
        textColor: theme.tooltipStyle === 'auto' && detectedBranding
            ? (detectedBranding.textColor === 'black' ? 'black' : 'white')
            : (theme.tooltipStyle === 'auto' ? 'white' : (theme.darkMode ? 'white' : 'black'))
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

    if (status !== 'playing' || !currentTour) {
        return null;
    }

    const currentStep = currentTour.steps[currentStepIndex];
    const isLastStep = currentStepIndex === currentTour.steps.length - 1;

    const handleNext = () => {
        if (isLastStep) {
            // Record play stats for behavior enforcement
            if (currentTour) {
                const storageKey = `producttour-seen-${currentTour.id}`;
                const existingData = localStorage.getItem(storageKey);
                let stats = { lastPlayedAt: 0, playCount: 0 };

                if (existingData) {
                    try {
                        const parsed = JSON.parse(existingData);
                        if (typeof parsed === 'object') {
                            stats = { ...stats, ...parsed };
                        }
                    } catch (e) {
                        // Fallback for old boolean values
                        if (existingData === 'true') stats.playCount = 1;
                    }
                }

                stats.lastPlayedAt = Date.now();
                stats.playCount += 1;
                localStorage.setItem(storageKey, JSON.stringify(stats));
                console.log('WidgetTourPlayer: Recorded stats for', currentTour.title, stats);
            }

            setStatus('idle');
            setCurrentStepIndex(0);
        } else {
            setCurrentStepIndex(prev => prev + 1);
        }
    };

    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="fixed inset-0 z-[2147483645] pointer-events-none product-tour-widget-root" style={{ fontFamily: activeTheme.fontFamily }}>
            {/* Spotlight Overlay */}
            {activeTheme.tooltipStyle !== 'glass' && (
                <svg
                    className="absolute inset-0 z-0"
                    style={{ width: '100%', height: '100%' }}
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
            )}

            {/* Blinking/Pulsing Highlight Border */}
            {activeTheme.tooltipStyle !== 'glass' && (
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
                    className="absolute z-10 border-2 rounded-lg"
                    style={{
                        left: targetRect.left - 6,
                        top: targetRect.top - 6,
                        width: targetRect.width + 12,
                        height: targetRect.height + 12,
                        borderColor: activeTheme.primaryColor,
                        boxShadow: `0 0 15px ${activeTheme.primaryColor}80`
                    }}
                />
            )}

            {/* Step Card */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={currentStep.id}
                className={cn(
                    "absolute z-20 p-6 border max-w-sm transition-all duration-300 pointer-events-auto overflow-hidden",
                    activeTheme.tooltipStyle === 'glass'
                        ? "backdrop-blur-[20px] saturate-[180%] border-white/5 text-white"
                        : (activeTheme.tooltipStyle === 'auto' || activeTheme.tooltipStyle === 'color')
                            ? "border-none shadow-2xl"
                            : (activeTheme.darkMode ? "bg-[#1e293b] border-slate-700 text-white shadow-2xl" : "bg-white border-slate-100 text-slate-900 shadow-2xl")
                )}
                style={{
                    left: (() => {
                        const marginX = window.innerWidth * 0.01;
                        const tooltipWidth = 384; // max-w-sm
                        return Math.min(window.innerWidth - tooltipWidth - marginX, Math.max(marginX, targetRect.left));
                    })(),
                    top: (() => {
                        const marginY = window.innerHeight * 0.01;
                        const potentialTop = targetRect.bottom + 40 > window.innerHeight - 250
                            ? targetRect.top - 240
                            : targetRect.bottom + 20;
                        return Math.min(window.innerHeight - 250, Math.max(marginY, potentialTop));
                    })(),
                    borderRadius: `${activeTheme.borderRadius}px`,
                    ...((activeTheme.tooltipStyle === 'color' || activeTheme.tooltipStyle === 'auto') ? { backgroundColor: activeTheme.tooltipColor, color: activeTheme.textColor, border: 'none' } : {}),
                    ...(activeTheme.tooltipStyle === 'glass' ? {
                        backgroundColor: 'rgba(15, 15, 15, 0.4)',
                        backdropFilter: 'blur(20px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                        boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
                        border: '1px solid #ffffff1a',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
                    } : {}),
                    fontFamily: activeTheme.fontFamily
                }}
            >
                <div className="flex items-start justify-end -mr-2 -mt-2 mb-2">
                    <button
                        className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center transition-colors",
                            (activeTheme.darkMode || activeTheme.tooltipStyle === 'glass') ? "hover:bg-black/5" : "hover:bg-white/10"
                        )}
                        style={{ color: (activeTheme.tooltipStyle === 'auto' || activeTheme.tooltipStyle === 'color') ? activeTheme.textColor : 'inherit' }}
                        onClick={() => setStatus('idle')}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <p className={cn("mb-4 leading-relaxed text-sm",
                    activeTheme.tooltipStyle === 'solid' ? (activeTheme.darkMode ? "text-slate-200" : "text-gray-700") :
                        (activeTheme.tooltipStyle === 'glass' ? "text-white" :
                            (activeTheme.textColor === 'white' ? "text-white" : "text-black"))
                )}
                    style={{ lineHeight: activeTheme.tooltipStyle === 'glass' ? '1.5' : 'inherit' }}
                >
                    {currentStep.content || "Click on this element to proceed."}
                </p>

                <div className="flex justify-end items-center gap-4 mt-3">
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest",
                        activeTheme.tooltipStyle === 'glass' ? "text-white/40" : "text-muted-foreground/40"
                    )}>
                        {currentStepIndex + 1} of {currentTour.steps.length}
                    </span>
                    <button
                        onClick={handleNext}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        className={cn(
                            "group flex items-center justify-center font-bold transition-all text-sm outline-none active:bg-black/10 active:scale-[0.985] [backface-visibility:hidden] transform-gpu",
                            activeTheme.tooltipStyle === 'solid' ? "shadow-sm hover:opacity-90" : "hover:bg-white/10"
                        )}
                        style={{
                            backgroundColor: activeTheme.tooltipStyle === 'solid' ? activeTheme.primaryColor :
                                (activeTheme.tooltipStyle === 'glass' ?
                                    (isHovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)') :
                                    (isHovered ? 'rgba(0,0,0,0.13)' : 'rgba(0,0,0,0.1)')),
                            color: activeTheme.tooltipStyle === 'glass' ? 'white' : activeTheme.textColor,
                            borderRadius: `${activeTheme.borderRadius}px`,
                            padding: `${activeTheme.paddingV}px ${activeTheme.paddingH}px`,
                            fontSize: activeTheme.tooltipStyle === 'glass' ? '0.8rem' : '0.9rem',
                            border: activeTheme.tooltipStyle === 'glass' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                            fontFamily: activeTheme.fontFamily
                        }}
                    >
                        {isLastStep ? 'Finish' : 'Next'}
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>
        </div >
    );
}
