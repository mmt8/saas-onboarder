
import React, { useEffect, useState, useRef } from 'react';
import { useTourStore } from '@/store/tour-store';
import { StepEditor } from '@/components/admin/StepEditor';
import { RecordingOverlay } from '@/components/admin/RecordingOverlay';
import { WidgetTourPlayer } from './WidgetTourPlayer';
import { Button } from '@/components/ui/button';
import { Play, Plus, X, HelpCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { CreateTourDialog } from '@/components/admin/CreateTourDialog';

interface WidgetProps {
    projectId: string;
    autoStart?: boolean;
    showAdminPanel?: boolean;
}

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
        isLoading
    } = useTourStore();

    const [isAdminListOpen, setAdminListOpen] = useState(false);
    const [isCreateTourDialogOpen, setIsCreateTourDialogOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);
    const prevLoadingRef = useRef(isLoading);
    const prevStatusRef = useRef(status);
    const hasAutoStartedOnPage = useRef<Record<string, boolean>>({});

    useEffect(() => {
        if (projectId) {
            setCurrentProject(projectId);
            console.log('Widget: Initializing with project', projectId);
            fetchProjects();
            fetchTours();
        }
    }, [projectId, setCurrentProject, fetchProjects, fetchTours]);

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

        // Find a tour that matches the current path
        const matchingTour = tours.find(t => {
            const tourPath = t.pageUrl || '/';
            // Simple match: exact or trailing slash difference
            return tourPath === currentPath ||
                (tourPath === '/' && currentPath === '') ||
                (tourPath === '' && currentPath === '/');
        });

        if (matchingTour) {
            const storageKey = `guidemark-seen-${matchingTour.id}`;
            const hasSeen = localStorage.getItem(storageKey);

            if (!hasSeen) {
                hasAutoStartedOnPage.current[currentPath] = true;
                console.log('Widget: Auto-starting tour', matchingTour.title, 'for path', currentPath);
                setTour(matchingTour);
                setStatus('playing');
                localStorage.setItem(storageKey, 'true');
            }
        }
    }, [tours, status, autoStart, projectId, setTour, setStatus, currentPath]);

    // Toast Logic for Save Success
    useEffect(() => {
        const wasLoading = prevLoadingRef.current;
        const wasRecording = prevStatusRef.current === 'recording';

        if (wasLoading && !isLoading) {
            if (wasRecording && status === 'idle') {
                toast.success('Tour saved successfully!', {
                    style: { background: '#10B981', color: 'white', border: 'none' }
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
        // Find matching tours for current page
        const matchingTours = tours.filter(t => (t.pageUrl || '/') === currentPath);
        console.log('Widget: Matching tours for path:', matchingTours);

        if (matchingTours.length > 0) {
            console.log('Widget: Starting matching tour', matchingTours[0].title);
            setTour(matchingTours[0]);
            setStatus('playing');
        } else if (tours.length > 0) {
            console.log('Widget: No matching tour, falling back to first', tours[0].title);
            // Fallback to first available tour if none match current page
            setTour(tours[0]);
            setStatus('playing');
        } else {
            console.warn('Widget: No tours available to play');
        }
    };

    // Get current project settings
    const currentProject = projects.find(p => p.id === projectId);
    const launcherText = currentProject?.launcherText || 'Product Tours';
    const shouldShowAdmin = showAdminPanel && (currentProject?.showLauncher !== false);

    // Debug logging
    console.log('Widget render:', { status, showAdminPanel, shouldShowAdmin, launcherText, toursCount: tours.length, currentPath });

    return (
        <div
            className="w-full h-full pointer-events-none font-sans text-base antialiased"
            style={{ ...themeStyles, color: '#0f172a' }}
        >
            <Toaster position="top-center" />

            {/* ===================== */}
            {/* ADMIN WIDGET - Product Tours Sidebar (right side, for creating/editing tours) */}
            {/* ===================== */}
            {shouldShowAdmin && status === 'idle' && (
                <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[2147483647] pointer-events-auto">
                    {!isAdminListOpen ? (
                        <div
                            onClick={() => setAdminListOpen(true)}
                            className="bg-[#495BFD] text-white py-3 px-2 rounded-l-lg cursor-pointer shadow-lg hover:pr-4 transition-all flex items-center gap-2"
                            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                        >
                            <span className="font-bold tracking-wide text-sm">{launcherText}</span>
                        </div>
                    ) : (
                        <div className="bg-white rounded-l-xl shadow-2xl w-80 h-[500px] flex flex-col border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b flex items-center justify-between bg-gray-50/50">
                                <h3 className="font-bold text-lg">Tours</h3>
                                <button onClick={() => setAdminListOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                {tours?.map(tour => (
                                    <div
                                        key={tour.id}
                                        onClick={() => {
                                            setAdminListOpen(false);
                                            editTour(tour);
                                        }}
                                        className="group p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 cursor-pointer transition-all"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 min-w-0 mr-2">
                                                <div className="font-semibold text-slate-800 truncate">{tour.title}</div>
                                                <div className="text-[10px] text-[#495BFD] font-mono truncate">{tour.pageUrl || '/'}</div>
                                                <div className="text-[10px] text-slate-500">{tour.steps.length} steps</div>
                                            </div>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="opacity-0 group-hover:opacity-100 h-8 w-8 hover:bg-blue-50"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAdminListOpen(false);
                                                    setTour(tour);
                                                    setStatus('playing');
                                                }}
                                            >
                                                <Play className="w-4 h-4 text-[#495BFD]" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t bg-gray-50">
                                <Button
                                    className="w-full gap-2 bg-[#495BFD] hover:bg-[#3b4fd9]"
                                    onClick={() => {
                                        setAdminListOpen(false);
                                        setIsCreateTourDialogOpen(true);
                                    }}
                                >
                                    <Plus className="w-4 h-4" />
                                    Create New Tour
                                </Button>
                            </div>
                        </div>
                    )}
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
                    <StepEditor />
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
        </div>
    );
}

