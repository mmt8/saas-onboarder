"use client";

import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateTourDialog } from "@/components/admin/CreateTourDialog";
import { useRouter } from "next/navigation";
import { CreateProjectDialog } from "@/components/admin/CreateProjectDialog";
import { DashboardNav } from "@/components/admin/DashboardNav";
import { InstallationTutorialModal } from "@/components/admin/InstallationTutorialModal";
import { RefreshCw, Play, Circle, AlertCircle, LogOut, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function ConnectionStatus({ lastSeenAt, onCheck, isChecking }: { lastSeenAt?: Date, onCheck: () => void, isChecking: boolean }) {
    const getStatus = () => {
        if (!lastSeenAt) return { label: 'Not Installed', color: 'bg-slate-400', text: 'text-slate-400' };

        const now = new Date();
        const diff = now.getTime() - lastSeenAt.getTime();
        const minutes = Math.floor(diff / 60000);

        // If last seen within 24 hours, mark as Synced (Green)
        if (minutes < 1440) return { label: 'Synced', color: 'bg-emerald-500', text: 'text-emerald-500' };

        // If seen before but not recently, mark as Offline (Amber)
        return { label: 'Offline', color: 'bg-amber-500', text: 'text-amber-500' };
    };

    const status = getStatus();

    return (
        <div className="flex items-center gap-2 px-3 py-1 bg-accent/50 rounded-full border border-border group transition-all hover:bg-accent h-7">
            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse shrink-0", status.color)} />
            <p className={cn("text-[10px] font-black uppercase tracking-[0.15em] leading-none", status.text)}>
                {status.label}
            </p>
            {lastSeenAt && (
                <p className="text-[9px] text-muted-foreground ml-1 hidden lg:block italic">
                    Seen {new Date(lastSeenAt).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
            )}
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
        fetchTours,
        signOut
    } = useTourStore();

    const [isInstallationModalOpen, setIsInstallationModalOpen] = useState(false);
    const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
    const [isCheckingConnection, setIsCheckingConnection] = useState(false);

    const handleRefreshConnection = async () => {
        setIsCheckingConnection(true);

        // Signal any open widget tabs on this domain to ping immediately
        localStorage.setItem('producttour-force-ping', Date.now().toString());

        // Short delay to give the widget time to ping and DB to update
        await new Promise(r => setTimeout(r, 1000));

        const freshProjects = await fetchProjects();

        const freshProject = freshProjects.find(p => p.id === currentProjectId);
        // 24 hours in milliseconds: 24 * 60 * 60 * 1000 = 86400000
        const isSynced = freshProject?.lastSeenAt && (new Date().getTime() - freshProject.lastSeenAt.getTime() < 86400000);

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
                        <img src="/logo.svg" alt="Guidemark Logo" className="w-full h-full" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-bounce" />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-bold font-fraunces leading-tight">
                            Welcome to <br />
                            <span className="text-primary">Guidemark</span>
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

        // Special case for Alpina and BetaGo test projects - ignore DB domain and use local earthy-site
        let targetUrl = currentProject?.domain;
        const testProjectIds = [
            '9621ba03-8fd8-48c3-9fcd-c029ac94df69', // Alpina
            '88ce9f20-d287-40c6-b73d-4d1c2472eb25'  // BetaGo
        ];

        if (currentProjectId && testProjectIds.includes(currentProjectId)) {
            targetUrl = 'http://localhost:3000/earthy-site.html';
        }

        if (!targetUrl) targetUrl = "http://localhost:3000";
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
        <div className="min-h-screen bg-background pt-7 px-8 pb-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col gap-8">
                    {/* New Header Section */}
                    <div className="flex items-center justify-between">
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <img src="/logo.svg" alt="Product Tour Logo" className="w-8 h-8 transition-transform group-hover:scale-105" />
                            <span className="font-serif font-bold text-xl tracking-tight text-foreground">Guidemark</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <Link
                                href="/dashboard/settings"
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-black/5 active:bg-black/10 transition-all rounded-full uppercase tracking-widest group"
                            >
                                <User className="w-4 h-4 transition-transform group-hover:scale-110" />
                                Account
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted-foreground hover:text-destructive hover:bg-black/5 active:bg-black/10 transition-all rounded-full group uppercase tracking-widest"
                            >
                                <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 pl-4 bg-card/40 border border-border rounded-[2rem] backdrop-blur-xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-background/50 p-1.5 rounded-2xl border border-border">
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
                                className="px-6 py-6 font-bold"
                            >
                                {isInstalled ? <Plus className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                                {isInstalled ? "Create New Tour" : "Setup Guidemark"}
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
