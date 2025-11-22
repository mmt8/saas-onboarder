"use client";

import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { Play, Plus, Clock, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { CreateTourDialog } from "@/components/admin/CreateTourDialog";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const { tours, setTour, setStatus, editTour } = useTourStore();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const router = useRouter();

    const handlePlay = (tour: any) => {
        // If tour belongs to a different page, navigate there
        if (tour.pageUrl && tour.pageUrl !== window.location.pathname) {
            router.push(`${tour.pageUrl}?playTour=${tour.id}`);
            return;
        }

        setTour(tour);
        setStatus('playing');
    };

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">My Tours</h1>
                        <p className="text-muted-foreground">Manage and edit your product tours</p>
                    </div>
                    <Button
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg shadow-primary/20"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Tour
                    </Button>
                </div>

                {tours.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-2xl bg-card/50">
                        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                            <Plus className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">No tours yet</h3>
                        <p className="text-muted-foreground mb-6 text-center max-w-md">
                            Create your first tour to start guiding your users.
                        </p>
                        <Button
                            onClick={() => setIsCreateDialogOpen(true)}
                            variant="outline"
                            className="border-border text-foreground hover:bg-secondary"
                        >
                            Create Tour
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tours.map((tour) => (
                            <div key={tour.id} className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/20 transition-all hover:shadow-xl hover:-translate-y-1">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="font-bold text-foreground truncate pr-4 text-lg">{tour.title}</h3>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(tour.createdAt), { addSuffix: true })}
                                        </div>
                                        <div>{tour.steps.length} steps</div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handlePlay(tour)}
                                            className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-sm"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Play
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-primary hover:bg-primary/5"
                                            onClick={() => editTour(tour)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <CreateTourDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
            />
        </div>
    );
}
