import React, { useEffect, useState, useLayoutEffect, useMemo } from "react";
import { useTourStore } from "@/store/tour-store";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { detectBranding, DetectedBranding } from "./utils/branding-detector";

// Types for tooltip positioning
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipPlacement {
    position: TooltipPosition;
    top: number;
    left: number;
    caretTop: number;
    caretLeft: number;
}

// Helper function to get luminance (L) from hex color
function getLuminanceFromHex(hex: string): number {
    // Remove # if present
    const cleanHex = hex.replace('#', '');

    // Parse RGB values
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

    // Find max and min values for HSL conversion
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    // Calculate lightness (L in HSL)
    const l = (max + min) / 2;

    // Return as percentage (0-100)
    return l * 100;
}

// Determine text color based on background luminance
function getTextColorForBackground(bgColor: string): 'black' | 'white' {
    const luminance = getLuminanceFromHex(bgColor);
    return luminance > 70 ? 'black' : 'white';
}

export function WidgetTourPlayer() {
    const { currentTour, status, setStatus, tours, setTour, projects, currentProjectId, pingProject } = useTourStore();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    // Initialize with centered rect using lazy initializer for SSR safety
    const [targetRect, setTargetRect] = useState<DOMRect | null>(() => {
        if (typeof window === 'undefined') return null;
        return new DOMRect(window.innerWidth / 2 - 100, 100, 200, 100);
    });

    // Lazy init branding to have it on first frame
    const [detectedBranding, setDetectedBranding] = useState<DetectedBranding | null>(() => detectBranding());

    // Find the project for theme settings
    const projectIdForTheme = currentTour?.project_id || currentProjectId;
    const currentProject = projects.find(p => p.id === projectIdForTheme);

    // DEBUG: Log theme resolution for FOUC tracking
    useEffect(() => {
        if (!currentProject) {
            console.warn('WidgetTourPlayer: currentProject is undefined. Using defaults (Orange/Solid). projects.length:', projects.length, 'ID:', projectIdForTheme);
        }
    }, [currentProject, projects.length, projectIdForTheme]);

    const theme = {
        fontFamily: currentProject?.themeSettings?.fontFamily ?? 'Inter, sans-serif',
        darkMode: currentProject?.themeSettings?.darkMode ?? false,
        primaryColor: currentProject?.themeSettings?.primaryColor ?? '#495BFD',
        borderRadius: currentProject?.themeSettings?.borderRadius ?? '20',
        paddingV: currentProject?.themeSettings?.paddingV ?? '10',
        paddingH: currentProject?.themeSettings?.paddingH ?? '20',
        tooltipStyle: currentProject?.themeSettings?.tooltipStyle ?? ('auto' as const),
        tooltipColor: currentProject?.themeSettings?.tooltipColor ?? '#495BFD',
        textColor: 'white'
    };

    // Use LayoutEffect to prevent FOUC (Flash of Unstyled Content)
    // Updates branding synchronously before paint
    useLayoutEffect(() => {
        if (theme.tooltipStyle === 'auto') {
            const branding = detectBranding();
            if (branding) setDetectedBranding(branding);
        }
    }, [theme.tooltipStyle]);

    // Merge auto-detected values into the functional theme
    const activeTheme = (() => {
        const resolvedTooltipColor = theme.tooltipStyle === 'auto' && detectedBranding
            ? detectedBranding.primaryColor
            : (theme.tooltipStyle === 'auto' ? '#495BFD' : theme.tooltipColor);

        // Determine text color based on tooltip style and background luminance
        let resolvedTextColor: 'black' | 'white';
        if (theme.tooltipStyle === 'color' || theme.tooltipStyle === 'auto') {
            // For color/auto styles, use luminance-based text color
            resolvedTextColor = getTextColorForBackground(resolvedTooltipColor);
        } else if (theme.tooltipStyle === 'glass') {
            // Glass always uses white text
            resolvedTextColor = 'white';
        } else {
            // Solid style uses theme dark mode setting
            resolvedTextColor = theme.darkMode ? 'white' : 'black';
        }

        return {
            ...theme,
            primaryColor: theme.tooltipStyle === 'auto' && detectedBranding ? detectedBranding.primaryColor : (theme.tooltipStyle === 'auto' ? '#495BFD' : theme.primaryColor),
            fontFamily: theme.tooltipStyle === 'auto' && detectedBranding ? detectedBranding.fontFamily : theme.fontFamily,
            borderRadius: theme.tooltipStyle === 'auto' && detectedBranding ? (() => {
                const val = parseFloat(detectedBranding.borderRadius);
                return isNaN(val) ? '12' : Math.min(Math.max(val, 0), 24).toString();
            })() : theme.borderRadius,
            tooltipColor: resolvedTooltipColor,
            textColor: resolvedTextColor
        };
    })();

    // Auto-start tour from URL param
    useEffect(() => {
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

    // Track target element position
    useEffect(() => {
        if (status !== 'playing' || !currentTour) return;

        const step = currentTour.steps[currentStepIndex];
        if (!step) return;

        // Immediately set a default rect so the component renders
        if (!targetRect) {
            setTargetRect(new DOMRect(window.innerWidth / 2 - 100, window.innerHeight / 2 - 50, 200, 100));
        }

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

    // Calculate optimal tooltip position with caret
    const tooltipPlacement = useMemo((): TooltipPlacement | null => {
        if (!targetRect || typeof window === 'undefined') return null;

        const TOOLTIP_WIDTH = 320;
        const TOOLTIP_HEIGHT = 180;
        const SAFE_MARGIN = Math.max(window.innerWidth, window.innerHeight) * 0.01; // 1% safe area
        const GAP = 16; // Gap between tooltip and target
        const CARET_SIZE = 10;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Target center
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;

        // Calculate available space in each direction
        const spaceTop = targetRect.top - SAFE_MARGIN;
        const spaceBottom = viewportHeight - targetRect.bottom - SAFE_MARGIN;
        const spaceLeft = targetRect.left - SAFE_MARGIN;
        const spaceRight = viewportWidth - targetRect.right - SAFE_MARGIN;

        // Determine best position based on available space
        let position: TooltipPosition;

        // Prefer bottom, then top, then right, then left
        if (spaceBottom >= TOOLTIP_HEIGHT + GAP) {
            position = 'bottom';
        } else if (spaceTop >= TOOLTIP_HEIGHT + GAP) {
            position = 'top';
        } else if (spaceRight >= TOOLTIP_WIDTH + GAP) {
            position = 'right';
        } else if (spaceLeft >= TOOLTIP_WIDTH + GAP) {
            position = 'left';
        } else {
            // Default to bottom with clamping
            position = 'bottom';
        }

        let top: number;
        let left: number;
        let caretTop: number;
        let caretLeft: number;

        switch (position) {
            case 'bottom':
                top = targetRect.bottom + GAP;
                left = targetCenterX - TOOLTIP_WIDTH / 2;
                // Clamp horizontal position
                left = Math.max(SAFE_MARGIN, Math.min(viewportWidth - TOOLTIP_WIDTH - SAFE_MARGIN, left));
                // Clamp vertical position
                top = Math.min(viewportHeight - TOOLTIP_HEIGHT - SAFE_MARGIN, top);
                // Caret points up to target
                caretTop = -CARET_SIZE;
                caretLeft = targetCenterX - left - CARET_SIZE;
                // Clamp caret to tooltip width
                caretLeft = Math.max(20, Math.min(TOOLTIP_WIDTH - 40, caretLeft));
                break;

            case 'top':
                top = targetRect.top - TOOLTIP_HEIGHT - GAP;
                left = targetCenterX - TOOLTIP_WIDTH / 2;
                // Clamp horizontal position
                left = Math.max(SAFE_MARGIN, Math.min(viewportWidth - TOOLTIP_WIDTH - SAFE_MARGIN, left));
                // Clamp vertical position
                top = Math.max(SAFE_MARGIN, top);
                // Caret points down to target
                caretTop = TOOLTIP_HEIGHT - 1;
                caretLeft = targetCenterX - left - CARET_SIZE;
                caretLeft = Math.max(20, Math.min(TOOLTIP_WIDTH - 40, caretLeft));
                break;

            case 'right':
                left = targetRect.right + GAP;
                top = targetCenterY - TOOLTIP_HEIGHT / 2;
                // Clamp positions
                left = Math.min(viewportWidth - TOOLTIP_WIDTH - SAFE_MARGIN, left);
                top = Math.max(SAFE_MARGIN, Math.min(viewportHeight - TOOLTIP_HEIGHT - SAFE_MARGIN, top));
                // Caret points left to target
                caretLeft = -CARET_SIZE;
                caretTop = targetCenterY - top - CARET_SIZE;
                caretTop = Math.max(20, Math.min(TOOLTIP_HEIGHT - 40, caretTop));
                break;

            case 'left':
                left = targetRect.left - TOOLTIP_WIDTH - GAP;
                top = targetCenterY - TOOLTIP_HEIGHT / 2;
                // Clamp positions
                left = Math.max(SAFE_MARGIN, left);
                top = Math.max(SAFE_MARGIN, Math.min(viewportHeight - TOOLTIP_HEIGHT - SAFE_MARGIN, top));
                // Caret points right to target
                caretLeft = TOOLTIP_WIDTH - 1;
                caretTop = targetCenterY - top - CARET_SIZE;
                caretTop = Math.max(20, Math.min(TOOLTIP_HEIGHT - 40, caretTop));
                break;
        }

        return { position, top, left, caretTop, caretLeft };
    }, [targetRect]);

    if (status !== 'playing' || !currentTour || !targetRect || !tooltipPlacement) return null;

    // Default fallback if project is missing (don't block render)

    if (!currentTour.steps || currentTour.steps.length === 0) {
        console.warn('WidgetTourPlayer: No steps found for tour', currentTour.title);
        return null; // Or show a toast?
    }

    const currentStep = currentTour.steps[currentStepIndex];
    if (!currentStep) {
        console.error('WidgetTourPlayer: Step not found at index', currentStepIndex);
        return null;
    }

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

    // Get caret color based on tooltip style
    const getCaretColor = () => {
        if (activeTheme.tooltipStyle === 'glass') {
            // Match glass tooltip background color
            return 'rgba(120, 120, 120, 0.6)';
        } else if (activeTheme.tooltipStyle === 'color' || activeTheme.tooltipStyle === 'auto') {
            return activeTheme.tooltipColor;
        } else {
            return activeTheme.darkMode ? '#1e293b' : '#ffffff';
        }
    };

    // Caret rotation based on position
    const caretRotation = {
        top: 180,    // Points down
        bottom: 0,   // Points up
        left: 90,    // Points right
        right: -90   // Points left
    };

    return (
        <div className="fixed inset-0 z-[2147483645] pointer-events-none product-tour-widget-root" style={{ fontFamily: activeTheme.fontFamily }}>
            {/* Spotlight Overlay - lighter for glass (20%), darker for others (60%) */}
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
                    fill={activeTheme.tooltipStyle === 'glass' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.6)'}
                    mask="url(#spotlight-mask)"
                    className="transition-all duration-500"
                />
            </svg>



            {/* Step Card with Caret */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={currentStep.id}
                className={cn(
                    "absolute z-20 p-6 border max-w-sm transition-all duration-300 pointer-events-auto overflow-visible",
                    activeTheme.tooltipStyle === 'glass'
                        ? "backdrop-blur-[20px] saturate-[180%] border-white/5 text-white"
                        : (activeTheme.tooltipStyle === 'auto' || activeTheme.tooltipStyle === 'color')
                            ? "border-none shadow-2xl"
                            : (activeTheme.darkMode ? "bg-[#1e293b] border-slate-700 text-white shadow-2xl" : "bg-white border-slate-100 text-slate-900 shadow-2xl")
                )}
                style={{
                    left: tooltipPlacement.left,
                    top: tooltipPlacement.top,
                    width: 320,
                    borderRadius: '24px',
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
                {/* Caret / Arrow pointing to target - skip for glass style */}
                {activeTheme.tooltipStyle !== 'glass' && (
                    <svg
                        className="absolute"
                        style={{
                            left: tooltipPlacement.caretLeft - 2,
                            top: tooltipPlacement.caretTop + (tooltipPlacement.position === 'bottom' ? 2 : tooltipPlacement.position === 'top' ? -2 : 0),
                            width: 24,
                            height: 12,
                            transform: `rotate(${caretRotation[tooltipPlacement.position]}deg)`,
                            transformOrigin: '12px 6px',
                            overflow: 'visible',
                        }}
                        viewBox="0 0 24 12"
                    >
                        <polygon
                            points="12,0 24,12 0,12"
                            fill={getCaretColor()}
                        />
                    </svg>
                )}

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
                    <span
                        className="text-[10px] font-semibold uppercase tracking-widest"
                        style={{
                            color: activeTheme.textColor,
                            opacity: 0.7
                        }}
                    >
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

