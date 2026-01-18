
import React, { useEffect, useState, useRef } from 'react';
import { useTourStore } from '@/store/tour-store';
import { StepEditor } from '@/components/admin/StepEditor';
import { RecordingOverlay } from '@/components/admin/RecordingOverlay';
import { WidgetTourPlayer } from './WidgetTourPlayer';
import { Button } from '@/components/ui/button';
import { Play, Plus, X, HelpCircle, Layout } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { CreateTourDialog } from '@/components/admin/CreateTourDialog';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tour } from '@/store/tour-store';

interface WidgetProps {
    projectId: string;
    autoStart?: boolean;
    showAdminPanel?: boolean;
}

const ProductTourLogo = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 794" className={className}>
        <path fill="#E65221" fillRule="evenodd" d="M 454.000 740.169 L 438.000 740.221 L 414.000 732.016 L 402.432 723.000 L 391.760 710.000 L 386.776 700.000 L 341.224 565.000 L 331.714 548.000 L 313.000 525.926 L 298.000 513.984 L 273.000 500.638 L 136.000 455.227 L 117.981 441.000 L 106.773 421.000 L 103.594 404.000 L 104.774 277.000 L 110.773 259.000 L 117.984 248.000 L 131.000 236.293 L 148.000 227.834 L 577.000 61.333 L 602.000 55.836 L 626.000 58.774 L 647.000 68.984 L 661.028 82.000 L 674.667 109.000 L 677.496 146.000 L 677.452 220.000 L 676.448 249.000 L 673.496 262.000 L 662.227 292.000 L 658.805 297.000 L 650.227 323.000 L 646.773 328.000 L 638.476 353.000 L 635.816 356.000 L 627.188 383.000 L 624.524 386.000 L 604.227 442.000 L 600.773 447.000 L 581.188 502.000 L 578.524 505.000 L 570.227 530.000 L 566.805 535.000 L 503.227 703.000 L 495.016 717.000 L 485.000 727.028 L 469.000 736.224 L 454.000 740.169 Z M 454.000 607.226 L 438.000 607.452 L 428.000 604.196 L 417.000 597.064 L 407.760 585.000 L 361.227 449.000 L 349.240 426.000 L 333.500 406.000 L 314.000 388.759 L 286.000 372.773 L 152.000 328.230 L 142.000 323.240 L 131.000 312.340 L 124.776 300.000 L 123.500 292.000 L 124.774 277.000 L 135.000 258.686 L 150.000 248.773 L 585.000 79.773 L 605.000 75.548 L 616.000 76.774 L 628.000 80.804 L 636.000 85.759 L 649.240 100.000 L 656.452 119.000 L 655.226 141.000 L 484.227 584.000 L 473.340 598.000 L 461.000 605.227 L 454.000 607.226 Z" />
        <path fill="#FFFFFF" d="M 454.000 607.226 L 438.000 607.452 L 428.000 604.196 L 417.000 597.064 L 407.760 585.000 L 361.227 449.000 L 349.240 426.000 L 333.500 406.000 L 314.000 388.759 L 286.000 372.773 L 152.000 328.230 L 142.000 323.240 L 131.000 312.340 L 124.776 300.000 L 123.500 292.000 L 124.774 277.000 L 135.000 258.686 L 150.000 248.773 L 585.000 79.773 L 605.000 75.548 L 616.000 76.774 L 628.000 80.804 L 636.000 85.759 L 649.240 100.000 L 656.452 119.000 L 655.226 141.000 L 484.227 584.000 L 473.340 598.000 L 461.000 605.227 L 454.000 607.226 Z" />
    </svg>
);

const Switch = ({ checked, onChange, disabled }: { checked: boolean, onChange: (val: boolean) => void, disabled?: boolean }) => (
    <button
        onClick={(e) => { e.stopPropagation(); if (!disabled) onChange(!checked); }}
        disabled={disabled}
        className={cn(
            "relative w-7 h-4 rounded-full transition-colors duration-200 outline-none",
            checked ? "bg-[#495BFD]" : "bg-slate-300",
            disabled && "opacity-50 cursor-not-allowed"
        )}
    >
        <motion.div
            animate={{ x: checked ? 12 : 2 }}
            initial={false}
            className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
    </button>
);

interface TourCardProps {
    tour: Tour;
    onEdit: () => void;
    onPlay: () => void;
    toggleTourActivation: (id: string) => Promise<void>;
    isLoading?: boolean;
    onActivationChange?: (msg: string) => void;
}
const TourCard = ({ tour, onEdit, onPlay, toggleTourActivation, isLoading, onActivationChange }: TourCardProps) => {

    return (
        <div
            onClick={onEdit}
            className={cn(
                "group p-4 bg-white rounded-2xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg hover:scale-[1.02] hover:relative hover:z-10 cursor-pointer transition-all duration-200",
                !tour.isActive && "opacity-85 grayscale-[0.1]"
            )}
            style={{ border: '1px solid #CBD5E1' }}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0 mr-2 space-y-1">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            tour.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-400"
                        )} />
                        <div className="font-semibold text-slate-800 truncate">{tour.title}</div>
                    </div>
                    <div className="text-[10px] text-[#495BFD] font-mono truncate px-3.5">{tour.pageUrl || '/'}</div>
                    <div className="text-[10px] text-slate-500 px-3.5 flex items-center gap-2">
                        <span>{tour.steps.length} steps</span>
                        <span>•</span>
                        <span>{new Date(tour.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Switch
                        checked={tour.isActive}
                        onChange={async (newState) => {
                            console.log('Widget: Toggling tour', tour.id, 'to', newState);
                            await toggleTourActivation(tour.id);
                            onActivationChange?.(newState ? "Tour activated" : "Tour deactivated");
                        }}
                        disabled={isLoading}
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        className="opacity-0 group-hover:opacity-100 h-8 w-8 hover:bg-blue-50 transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPlay();
                        }}
                    >
                        <Play className="w-4 h-4 text-[#495BFD]" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export function Widget({ projectId, autoStart = true, showAdminPanel = true }: WidgetProps) {
    const {
        status,
        startRecording,
        setCurrentProject,
        fetchProjects,
        fetchTours,
        projects,
        currentProjectId,
        tours,
        editTour,
        setTour,
        setStatus,
        isLoading,
        stopRecording,
        toggleTourActivation,
        pingProject
    } = useTourStore();

    // Dynamically load theme font
    useEffect(() => {
        const currentProject = projects.find(p => p.id === projectId);
        if (currentProject?.themeSettings?.fontFamily) {
            const fontName = currentProject.themeSettings.fontFamily.split(',')[0].trim().replace(/['"]/g, '');
            if (fontName) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap`;
                document.head.appendChild(link);
            }
        }
    }, [projects, projectId]);

    const [isAdminListOpen, setAdminListOpen] = useState(false);
    const [isCreateTourDialogOpen, setIsCreateTourDialogOpen] = useState(false);
    const [tourFilter, setTourFilter] = useState<'all' | 'page'>('page');
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const [feedback, setFeedback] = useState<string | null>(null);
    const prevLoadingRef = useRef(isLoading);
    const prevStatusRef = useRef(status);
    const hasAutoStartedOnPage = useRef<Record<string, boolean>>({});

    // Auto-start creation mode from URL param
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('createTour') === 'true') {
            setIsCreateTourDialogOpen(true);
            // Clear the param
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('createTour');
            newUrl.searchParams.set('projectId', projectId); // Keep project ID just in case
            window.history.replaceState({}, '', newUrl.toString());
        }
    }, [projectId]);

    // Track admin mode to suppress auto-start for regular users vs admins
    useEffect(() => {
        if (showAdminPanel) {
            localStorage.setItem('producttour-admin-mode', 'true');
        }
    }, [showAdminPanel]);

    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => setFeedback(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    useEffect(() => {
        if (projectId) {
            setCurrentProject(projectId);
            console.log('Widget: Initializing with project', projectId);

            // Only ping if NOT in the dashboard (prevent heartbeats from the admin app itself)
            // We allow pings from localhost/test pages so developers see "Online" status.
            const isDashboard = window.location.pathname.startsWith('/dashboard');

            if (!isDashboard) {
                console.log('Widget: Sending heartbeat for project', projectId);
                pingProject(projectId);
            }

            fetchProjects();
            fetchTours();
        }
    }, [projectId, setCurrentProject, fetchProjects, fetchTours, pingProject]);

    // Listen for forced ping requests from Dashboard (same domain only)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'producttour-force-ping' && e.newValue && projectId) {
                console.log('Widget: Forced heartbeat requested from Dashboard');
                pingProject(projectId);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [projectId, pingProject]);

    // Track URL changes for SPA support
    useEffect(() => {
        const handleLocationChange = () => {
            if (window.location.pathname !== currentPath) {
                console.log('Widget: Path changed to', window.location.pathname);
                setCurrentPath(window.location.pathname);
            }
        };

        window.addEventListener('popstate', handleLocationChange);

        // Polling as a fallback for some SPA routers that don't trigger popstate
        const interval = setInterval(handleLocationChange, 1000);

        return () => {
            window.removeEventListener('popstate', handleLocationChange);
            clearInterval(interval);
        };
    }, [currentPath]);

    // Auto-start tour on page load (per-tour, matching current path)
    useEffect(() => {
        if (!autoStart || hasAutoStartedOnPage.current[currentPath]) return;
        if (tours.length === 0 || status !== 'idle') return;

        // Don't auto-start if admin panel is open or if we are in admin mode or if dialog is open
        const isAdmin = showAdminPanel || localStorage.getItem('producttour-admin-mode') === 'true';
        if (isAdminListOpen || isAdmin || isCreateTourDialogOpen) return;

        // Find an ACTIVE tour that matches the current path
        const matchingTour = tours.find(t => {
            const tourPath = (t.pageUrl || '/').replace(/\/$/, '') || '/';
            const activePath = currentPath.replace(/\/$/, '') || '/';
            return tourPath === activePath && t.isActive;
        });

        if (matchingTour) {
            const storageKey = `producttour-seen-${matchingTour.id}`;
            const hasSeen = localStorage.getItem(storageKey);

            if (!hasSeen) {
                hasAutoStartedOnPage.current[currentPath] = true;
                console.log('Widget: Auto-starting tour', matchingTour.title, 'for path', currentPath);
                setTour(matchingTour);
                setStatus('playing');
                localStorage.setItem(storageKey, 'true');
            }
        }
    }, [tours, status, autoStart, projectId, setTour, setStatus, currentPath, isAdminListOpen, isCreateTourDialogOpen]);

    // Toast Logic for Save Success
    useEffect(() => {
        const wasLoading = prevLoadingRef.current;
        const wasRecording = prevStatusRef.current === 'recording';

        if (wasLoading && !isLoading) {
            if (wasRecording && status === 'idle') {
                toast.success('Tour saved successfully!', {
                    style: { background: '#10B981', color: 'white', border: 'none' },
                    duration: 3000
                });
            }
        }

        prevLoadingRef.current = isLoading;
        prevStatusRef.current = status;
    }, [isLoading, status]);

    // Define CSS variables for Shadow DOM context
    const themeStyles = {
        '--background': '#FAF9F5',
        '--foreground': '#1a1a1a',
        '--primary': '#495BFD',
        '--primary-foreground': '#ffffff',
        '--secondary': '#ffffff',
        '--secondary-foreground': '#1a1a1a',
        '--card': '#ffffff',
        '--card-foreground': '#1a1a1a',
        '--popover': '#ffffff',
        '--popover-foreground': '#1a1a1a',
        '--muted': '#737373',
        '--muted-foreground': '#737373',
        '--accent': '#f4f4f5',
        '--accent-foreground': '#1a1a1a',
        '--destructive': '#ef4444',
        '--destructive-foreground': '#ffffff',
        '--border': '#e5e5e5',
        '--input': '#e5e5e5',
        '--ring': '#495BFD',
        '--radius': '0.75rem',
    } as React.CSSProperties;

    const handleUserStartTour = () => {
        console.log('Widget: handleUserStartTour triggered', { currentPath, toursCount: tours.length });

        // Find the ACTIVE tour that matches the current path
        const matchingActiveTour = tours.find(t => {
            const tourPath = (t.pageUrl || '/').replace(/\/$/, '') || '/';
            const activePath = (currentPath || '/').replace(/\/$/, '') || '/';
            return tourPath === activePath && t.isActive;
        });

        if (matchingActiveTour) {
            console.log('Widget: Starting active tour for this page', matchingActiveTour.title);
            setTour(matchingActiveTour);
            setStatus('playing');
        } else {
            // Fallback: If no active tour for this page, check if there's ANY active tour overall
            // or just pick the first active one we find.
            const anyActiveTour = tours.find(t => t.isActive);
            if (anyActiveTour) {
                console.log('Widget: No active tour for this page, falling back to active tour:', anyActiveTour.title);
                setTour(anyActiveTour);
                setStatus('playing');
            } else if (tours.length > 0) {
                // Last resort: Just play the most recent tour (inactive)
                console.log('Widget: No active tours found, falling back to first available');
                setTour(tours[0]);
                setStatus('playing');
            } else {
                console.warn('Widget: No tours available to play');
            }
        }
    };

    // Get current project settings
    const currentProject = projects.find(p => p.id === projectId);
    const launcherText = currentProject?.launcherText || 'Product Tours';
    const shouldShowAdmin = showAdminPanel && (currentProject?.showLauncher !== false);

    const theme = currentProject?.themeSettings || {
        fontFamily: 'Inter, sans-serif',
        darkMode: false,
        primaryColor: '#495BFD',
        borderRadius: '12',
        paddingV: '10',
        paddingH: '20'
    };

    // Debug logging
    console.log('Widget render:', { status, showAdminPanel, shouldShowAdmin, launcherText, toursCount: tours.length, currentPath });

    return (
        <div
            className="w-full h-full pointer-events-none font-sans text-base antialiased"
            style={{ ...themeStyles, color: '#0f172a', fontFamily: theme.fontFamily }}
        >
            <Toaster position="top-center" />

            {/* ===================== */}
            {/* ADMIN WIDGET - Floating Admin Panel */}
            {/* ===================== */}
            {shouldShowAdmin && (
                <div className="fixed right-0 top-24 z-[2147483647] pointer-events-auto admin-toolbar-ignore">
                    <AnimatePresence mode="wait">
                        {!isAdminListOpen && status === 'idle' ? (
                            <motion.div
                                key="launcher"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                onClick={() => setAdminListOpen(true)}
                                className="bg-white p-2 pr-2.5 cursor-pointer flex items-center hover:pr-5 hover:pl-3 transition-all"
                                style={{
                                    border: '1px solid #E2E8F0', // slate-200
                                    borderRight: 'none',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-lg
                                    borderTopLeftRadius: '0.75rem', // rounded-l-xl
                                    borderBottomLeftRadius: '0.75rem'
                                }}
                            >
                                <ProductTourLogo className="w-8 h-8" />
                            </motion.div>
                        ) : (isAdminListOpen && status === 'idle') || status === 'recording' ? (
                            <motion.div
                                key="admin-panel"
                                layout
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="bg-white px-0 w-80 flex flex-col overflow-hidden mr-6"
                                style={{
                                    borderRadius: '1.5rem',
                                    boxShadow: '0 8px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)',
                                    fontFamily: theme.fontFamily
                                }}
                            >
                                {status === 'idle' ? (
                                    <div className="flex flex-col h-[600px]">
                                        <div className="p-6 pb-2 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-bold text-xl text-slate-900 font-sans tracking-tight">Tours</h3>
                                                <button
                                                    onClick={() => setAdminListOpen(false)}
                                                    className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors group"
                                                >
                                                    <X className="w-5 h-5 text-slate-400 group-hover:text-slate-600" />
                                                </button>
                                            </div>

                                            {/* Filter Tabs */}
                                            <div className="flex p-1 bg-slate-200/50 rounded-xl">
                                                <button
                                                    onClick={() => setTourFilter('page')}
                                                    className={cn(
                                                        "flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                                                        tourFilter === 'page' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-800"
                                                    )}
                                                >
                                                    This Page
                                                </button>
                                                <button
                                                    onClick={() => setTourFilter('all')}
                                                    className={cn(
                                                        "flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                                                        tourFilter === 'all' ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-800"
                                                    )}
                                                >
                                                    All Tours
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 pt-0.5 space-y-4">
                                            <AnimatePresence>
                                                {feedback && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-medium border border-emerald-100 flex items-center justify-between mb-2">
                                                            <span>{feedback}</span>
                                                            <button onClick={() => setFeedback(null)}>
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            {(() => {
                                                const filteredTours = tours
                                                    .filter(t => {
                                                        if (tourFilter === 'all') return true;
                                                        const tourPath = (t.pageUrl || '/').replace(/\/$/, '') || '/';
                                                        const activePath = (currentPath || '/').replace(/\/$/, '') || '/';
                                                        return tourPath === activePath;
                                                    })
                                                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                                                const activeTours = filteredTours.filter(t => t.isActive);
                                                const inactiveTours = filteredTours.filter(t => !t.isActive);

                                                return (
                                                    <div className="space-y-4">
                                                        {/* Active List */}
                                                        <div className="space-y-3">
                                                            {activeTours.map(tour => (
                                                                <TourCard
                                                                    key={tour.id}
                                                                    tour={tour}
                                                                    onEdit={() => { setAdminListOpen(false); editTour(tour); }}
                                                                    onPlay={() => { setAdminListOpen(false); setTour(tour); setStatus('playing'); }}
                                                                    toggleTourActivation={toggleTourActivation}
                                                                    isLoading={isLoading}
                                                                    onActivationChange={setFeedback}
                                                                />
                                                            ))}
                                                        </div>

                                                        {/* Separator */}
                                                        {activeTours.length > 0 && inactiveTours.length > 0 && (
                                                            <div className="flex items-center gap-3 px-2">
                                                                <div className="h-px bg-slate-200 flex-1" />
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Inactive</span>
                                                                <div className="h-px bg-slate-200 flex-1" />
                                                            </div>
                                                        )}

                                                        {/* Inactive List */}
                                                        <div className="space-y-3">
                                                            {inactiveTours.map(tour => (
                                                                <TourCard
                                                                    key={tour.id}
                                                                    tour={tour}
                                                                    onEdit={() => { setAdminListOpen(false); editTour(tour); }}
                                                                    onPlay={() => { setAdminListOpen(false); setTour(tour); setStatus('playing'); }}
                                                                    toggleTourActivation={toggleTourActivation}
                                                                    isLoading={isLoading}
                                                                    onActivationChange={setFeedback}
                                                                />
                                                            ))}
                                                        </div>

                                                        {filteredTours.length === 0 && (
                                                            <div className="text-center py-8 text-slate-400 text-sm">
                                                                No tours found.
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <div className="p-6">
                                            <Button
                                                className="w-full h-11 gap-2 bg-[#495BFD] hover:bg-[#3b4fd9] text-white rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                                                onClick={() => {
                                                    setAdminListOpen(false);
                                                    setIsCreateTourDialogOpen(true);
                                                }}
                                            >
                                                <Plus className="w-5 h-5" />
                                                Create New Tour
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-[calc(100vh-10rem)] max-h-[700px]">
                                        <StepEditor
                                            isFloating={false}
                                            onBack={() => {
                                                stopRecording();
                                                setAdminListOpen(true);
                                            }}
                                            onSuccess={setFeedback}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            )}

            {/* ===================== */}
            {/* USER WIDGET - Help Button (bottom-right, for end-users to replay tours) */}
            {/* ===================== */}
            {status === 'idle' && tours.length > 0 && (
                <div className="fixed bottom-6 right-6 z-[2147483646] pointer-events-auto">
                    <button
                        onClick={handleUserStartTour}
                        className="w-14 h-14 bg-[#495BFD] rounded-full shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-200"
                        title="Need help? Start a guided tour"
                    >
                        <HelpCircle className="w-7 h-7 text-white" />
                    </button>
                </div>
            )}

            {/* Recording Mode */}
            {status === 'recording' && (
                <div className="contents pointer-events-auto">
                    <RecordingOverlay />
                </div>
            )}

            {/* Playing Mode */}
            {status === 'playing' && (
                <WidgetTourPlayer />
            )}

            <CreateTourDialog
                isOpen={isCreateTourDialogOpen}
                onClose={() => setIsCreateTourDialogOpen(false)}
            />
            <Toaster position="top-center" expand={true} richColors duration={3000} />
        </div>
    );
}

