"use client";

import { useTourStore, Tour } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { Plus, Play, Trash2, Loader2, Copy, Code, Settings, Clock, Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateTourDialog } from "@/components/admin/CreateTourDialog";
import { DeleteTourDialog } from "@/components/admin/DeleteTourDialog";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { CreateProjectDialog } from "@/components/admin/CreateProjectDialog";
import { Sparkles } from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const {
        tours,
        projects,
        currentProjectId,
        setCurrentProject,
        fetchProjects,
        setTour,
        setStatus,
        editTour,
        deleteTour,
        fetchTours,
        isLoading,
        recordedSteps,
        isRecording,
        user,
        isAuthLoading
    } = useTourStore();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
    const [deletingTour, setDeletingTour] = useState<Tour | null>(null);


    // Auto-open save dialog if we have steps from a recording
    useEffect(() => {
        if (recordedSteps.length > 0 && !isRecording) {
            setIsCreateDialogOpen(true);
        }
    }, [recordedSteps, isRecording]);

    // Client-side auth guard
    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.push("/login");
        }
    }, [user, isAuthLoading, router]);

    const [activeTab, setActiveTab] = useState<'tours' | 'installation' | 'settings'>('tours');
    const [launcherText, setLauncherText] = useState("");
    const [showLauncher, setShowLauncher] = useState(true);
    const currentProject = projects.find(p => p.id === currentProjectId);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        if (currentProjectId) {
            fetchTours();
            if (currentProject) {
                setLauncherText(currentProject.launcherText);
                setShowLauncher(currentProject.showLauncher);
            }
        }
    }, [currentProjectId, fetchTours, currentProject]);

    const handlePlay = (tour: Tour) => {
        if (tour.pageUrl && tour.pageUrl !== window.location.pathname) {
            router.push(`${tour.pageUrl}?playTour=${tour.id}`);
            return;
        }
        setTour(tour);
        setStatus('playing');
    };

    const handleDelete = async () => {
        if (deletingTour) {
            await deleteTour(deletingTour.id);
            setDeletingTour(null);
        }
    };

    const handleSaveSettings = async () => {
        if (currentProjectId) {
            await useTourStore.getState().updateProjectSettings(currentProjectId, {
                showLauncher,
                launcherText
            });
            alert("Settings saved successfully!");
        }
    };

    const embedCode = `<script
  id="guidemark-embed"
  src="https://naiuhnzdampxdewizhin.supabase.co/storage/v1/object/public/widgets/embed.js"
  data-project-id="${currentProjectId || 'YOUR_PROJECT_ID'}"
  async
></script>`;

    if (isAuthLoading || (isLoading && projects.length === 0)) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // Onboarding State
    if (projects.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-8">
                <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in zoom-in duration-700">
                    <div className="relative mx-auto w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-primary" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-bounce" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold font-fraunces leading-tight">
                            Welcome to <br />
                            <span className="text-primary">GuideMark</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed">
                            Every great journey begins with a project. Create yours now to start building interactive tours for your users.
                        </p>
                    </div>

                    <Button
                        size="lg"
                        onClick={() => setIsCreateProjectOpen(true)}
                        className="w-full py-10 text-2xl font-bold bg-primary text-primary-foreground rounded-3xl shadow-2xl shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                    >
                        Create Your First Project
                        <Plus className="ml-2 w-6 h-6" />
                    </Button>

                    <CreateProjectDialog
                        isOpen={isCreateProjectOpen}
                        onClose={() => setIsCreateProjectOpen(false)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <style jsx global>{`
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
            `}</style>

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header & Project Selector */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2 font-fraunces">Dashboard</h1>
                        <div className="flex items-center gap-3">
                            <select
                                value={currentProjectId || ""}
                                onChange={(e) => setCurrentProject(e.target.value)}
                                className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <p className="text-muted-foreground text-sm">Cloud Sync Enabled</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-secondary/50 p-1 rounded-xl">
                            <button
                                onClick={() => setActiveTab('tours')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'tours' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Tours
                            </button>
                            <button
                                onClick={() => setActiveTab('installation')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'installation' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Installation
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Settings
                            </button>
                        </div>
                        <Button
                            onClick={() => setIsCreateDialogOpen(true)}
                            className="bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/20 hover:shadow-md hover:brightness-110 transition-all duration-200"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Tour
                        </Button>
                    </div>
                </div>

                {activeTab === 'tours' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tours.map(tour => (
                            <div key={tour.id} className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">{tour.title}</h3>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="text-muted-foreground hover:text-destructive transition-colors"
                                            onClick={() => setDeletingTour(tour)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            <span>{tour.updatedAt ? formatDistanceToNow(new Date(tour.updatedAt)) : 'recent'} ago</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            <span>{tour.steps.length} steps</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            onClick={() => handlePlay(tour)}
                                            className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold rounded-xl"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Play
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                editTour(tour);
                                            }}
                                            className="flex-1 font-semibold rounded-xl border-border hover:bg-secondary transition-colors"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {tours.length === 0 && !isLoading && (
                            <div className="col-span-full py-20 text-center bg-secondary/20 rounded-3xl border-2 border-dashed border-border">
                                <div className="bg-background w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <Plus className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No tours yet</h3>
                                <p className="text-muted-foreground mb-8">Create your first product tour to guide your users.</p>
                                <Button onClick={() => setIsCreateDialogOpen(true)}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Tour
                                </Button>
                            </div>
                        )}
                    </div>
                ) : activeTab === 'installation' ? (
                    <div className="p-8 border-dashed border-2 border-border bg-secondary/30 rounded-2xl">
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <div className="p-4 bg-primary/10 rounded-2xl">
                                <Code className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-3 font-fraunces">Embed GuideMark</h3>
                                <p className="text-muted-foreground mb-8 text-lg">
                                    Copy and paste this script tag into the <code className="bg-secondary px-2 py-1 rounded text-foreground font-mono text-sm">&lt;head&gt;</code> of your website.
                                </p>

                                <div className="relative group">
                                    <pre className="bg-card border border-border p-6 rounded-2xl overflow-x-auto font-mono text-sm text-foreground shadow-inner">
                                        {embedCode}
                                    </pre>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background shadow-sm"
                                        onClick={() => {
                                            navigator.clipboard.writeText(embedCode);
                                            alert("Script copied to clipboard!");
                                        }}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-card border border-border rounded-3xl p-8 space-y-8 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl">
                                    <Settings className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold font-fraunces">Widget Launcher</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-secondary/30 rounded-2xl border border-border/50">
                                    <div className="space-y-1">
                                        <label className="font-bold text-lg">Show Launcher Bubble</label>
                                        <p className="text-sm text-muted-foreground">Display the floating "ear" on your site</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={showLauncher}
                                        onChange={(e) => setShowLauncher(e.target.checked)}
                                        className="w-6 h-6 accent-primary cursor-pointer"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Launcher Label Text</label>
                                    <input
                                        type="text"
                                        value={launcherText}
                                        onChange={(e) => setLauncherText(e.target.value)}
                                        placeholder="e.g. Product Tours"
                                        className="w-full bg-secondary/20 border border-border rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleSaveSettings}
                                disabled={isLoading}
                                className="w-full py-8 text-xl font-bold bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/20 hover:shadow-sm transition-all active:scale-95"
                            >
                                {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : null}
                                Save Project Settings
                            </Button>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-center">Live Preview</h4>
                            <div className="relative aspect-[16/10] bg-neutral-900 rounded-[2rem] overflow-hidden border-8 border-neutral-800 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] flex items-center justify-center group">
                                <div className="absolute top-6 left-6 flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/30" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/30" />
                                </div>

                                {showLauncher && (
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-5 py-10 rounded-l-[1.5rem] font-bold text-sm vertical-text shadow-2xl animate-in slide-in-from-right duration-500 ring-4 ring-neutral-900/50">
                                        {launcherText || "Product Tours"}
                                    </div>
                                )}
                                <div className="text-neutral-700 font-mono text-sm select-none">
                                    Your Website Canvas
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            </div>
                            <p className="text-center text-sm text-muted-foreground">The widget will appear docked to the right edge of your website.</p>
                        </div>
                    </div>
                )}
            </div>

            <CreateTourDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
            />

            <DeleteTourDialog
                isOpen={!!deletingTour}
                onClose={() => setDeletingTour(null)}
                onConfirm={handleDelete}
                tourTitle={deletingTour?.title || ""}
            />

            <CreateProjectDialog
                isOpen={isCreateProjectOpen}
                onClose={() => setIsCreateProjectOpen(false)}
            />
        </div>
    );
}
