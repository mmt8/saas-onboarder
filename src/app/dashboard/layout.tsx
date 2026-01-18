"use client";

import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateTourDialog } from "@/components/admin/CreateTourDialog";
import { useRouter } from "next/navigation";
import { CreateProjectDialog } from "@/components/admin/CreateProjectDialog";
import { Sparkles } from "lucide-react";
import { DashboardNav } from "@/components/admin/DashboardNav";
import { InstallationTutorialModal } from "@/components/admin/InstallationTutorialModal";
import { RefreshCw, Play, Circle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function ConnectionStatus({ lastSeenAt, onCheck, isChecking }: { lastSeenAt?: Date, onCheck: () => void, isChecking: boolean }) {
    const getStatus = () => {
        if (!lastSeenAt) return { label: 'Not Installed', color: 'bg-slate-400', text: 'text-slate-400' };

        const now = new Date();
        const diff = now.getTime() - lastSeenAt.getTime();
        const minutes = Math.floor(diff / 60000);

        // If last seen within 60 minutes, mark as Synced (Green)
        if (minutes < 60) return { label: 'Synced', color: 'bg-emerald-500', text: 'text-emerald-500' };

        // If seen before but not recently, mark as Offline (Amber)
        return { label: 'Offline', color: 'bg-amber-500', text: 'text-amber-500' };
    };

    const status = getStatus();

    return (
        <div className="flex items-center gap-2 px-3 py-1 bg-accent/50 rounded-full border border-border/50 group transition-all hover:bg-accent h-7">
            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse shrink-0", status.color)} />
            <p className={cn("text-[10px] font-black uppercase tracking-[0.15em] leading-none", status.text)}>
                {status.label}
            </p>
            <button
                onClick={(e) => { e.preventDefault(); onCheck(); }}
                disabled={isChecking}
                className="ml-1 transition-all disabled:opacity-50 p-1 hover:bg-background/80 hover:text-primary rounded-md flex items-center justify-center active:scale-90"
                title="Check connection"
            >
                <RefreshCw className={cn("w-3 h-3 text-muted-foreground", isChecking && "animate-spin")} />
            </button>
        </div>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const {
        projects,
        currentProjectId,
        setCurrentProject,
        fetchProjects,
        isLoading,
        user,
        isAuthLoading,
        fetchTours
    } = useTourStore();

    const [isInstallationModalOpen, setIsInstallationModalOpen] = useState(false);
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
    const [isCheckingConnection, setIsCheckingConnection] = useState(false);

    const handleRefreshConnection = async () => {
        setIsCheckingConnection(true);
        const freshProjects = await fetchProjects();

        const freshProject = freshProjects.find(p => p.id === currentProjectId);
        const isSynced = freshProject?.lastSeenAt && (new Date().getTime() - freshProject.lastSeenAt.getTime() < 3600000); // 1 hour

        if (!isSynced) {
            setIsInstallationModalOpen(true);
            toast.error("No active signal detected.", {
                description: "Make sure the script is installed and your page is open."
            });
        } else {
            toast.success("Connection verified!");
        }

        setIsCheckingConnection(false);
    };

    // Client-side auth guard
    useEffect(() => {
        if (!isAuthLoading && !user) {
            router.push("/login");
        }
    }, [user, isAuthLoading, router]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    useEffect(() => {
        if (currentProjectId) {
            fetchTours();
        }
    }, [currentProjectId, fetchTours]);

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
                    <div className="relative mx-auto w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center p-4">
                        <img src="/logo.svg" alt="Product Tour Logo" className="w-full h-full" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-bounce" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold font-fraunces leading-tight">
                            Welcome to <br />
                            <span className="text-primary">Product Tour</span>
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
    const currentProject = projects.find(p => p.id === currentProjectId);
    const isInstalled = !!currentProject?.lastSeenAt;

    const handleCreateTour = () => {
        if (!isInstalled) {
            setIsInstallationModalOpen(true);
            return;
        }

        // Redirect to project domain with creation mode param
        let targetUrl = currentProject?.domain || "http://localhost:3000";
        if (!targetUrl.startsWith('http')) targetUrl = `https://${targetUrl}`;

        try {
            const url = new URL(targetUrl);
            url.searchParams.set('createTour', 'true');
            url.searchParams.set('projectId', currentProjectId!);
            window.open(url.toString(), '_blank');
        } catch (e) {
            toast.error("Invalid project domain URL");
        }
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-foreground font-fraunces">Dashboard</h1>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 pl-4 bg-card/40 border border-border/50 rounded-[2rem] backdrop-blur-xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-background/50 p-1.5 rounded-2xl border border-border/50">
                                <div className="relative flex items-center">
                                    <select
                                        value={currentProjectId || ""}
                                        onChange={(e) => setCurrentProject(e.target.value)}
                                        className="bg-transparent border-none pl-3 pr-2 py-1 text-sm focus:outline-none cursor-pointer hover:bg-secondary/40 rounded-lg transition-all font-bold text-foreground appearance-none min-w-[120px]"
                                    >
                                        {projects.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none ml-[-20px] mr-2">
                                        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="text-muted-foreground">
                                            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setIsCreateProjectOpen(true)}
                                    className="w-8 h-8 rounded-xl hover:bg-primary/10 text-primary"
                                    title="Create New Project"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <ConnectionStatus
                                lastSeenAt={currentProject?.lastSeenAt}
                                onCheck={handleRefreshConnection}
                                isChecking={isCheckingConnection}
                            />
                        </div>

                        <div className="flex items-center gap-8">
                            <DashboardNav />
                            <div className="w-px h-6 bg-border/60 hidden md:block" />
                            <Button
                                onClick={handleCreateTour}
                                className={cn(
                                    "rounded-full px-6 py-6 shadow-lg transition-all duration-200 font-bold",
                                    isInstalled
                                        ? "bg-primary text-primary-foreground shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
                                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                )}
                            >
                                {isInstalled ? <Plus className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                                {isInstalled ? "Create New Tour" : "Setup Product Tour"}
                            </Button>
                        </div>
                    </div>
                </div>

                {children}
            </div>

            <InstallationTutorialModal
                isOpen={isInstallationModalOpen}
                onClose={() => setIsInstallationModalOpen(false)}
                projectId={currentProjectId || ""}
            />

            <CreateProjectDialog
                isOpen={isCreateProjectOpen}
                onClose={() => setIsCreateProjectOpen(false)}
            />
        </div>
    );
}
