"use client";

import { useTourStore, Tour } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { Play, Trash2, Clock, Edit, Globe, Plus, Zap, ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { DeleteTourDialog } from "@/components/admin/DeleteTourDialog";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
            animate={{ x: checked ? 14 : 2 }}
            initial={false}
            className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
    </button>
);

export default function ToursPage() {
    const router = useRouter();
    const {
        tours,
        setTour,
        setStatus,
        editTour,
        deleteTour,
        isLoading,
        toggleTourActivation,
        updateTourBehavior
    } = useTourStore();

    const [deletingTour, setDeletingTour] = useState<Tour | null>(null);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

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

    return (
        <>
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
                                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                    <Globe className="w-3.5 h-3.5 text-primary/60" />
                                    <span className="truncate">{tour.pageUrl || '/'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{tour.updatedAt ? formatDistanceToNow(new Date(tour.updatedAt)) : 'recent'} ago</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-1.5">
                                    <div className={cn("w-2 h-2 rounded-full", tour.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-300")} />
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {tour.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-muted-foreground">{tour.steps.length} steps</span>
                                    <Switch
                                        checked={tour.isActive}
                                        onChange={async (newState) => {
                                            await toggleTourActivation(tour.id);
                                            if (newState) {
                                                toast.success(`"${tour.title}" activated`, {
                                                    description: `This tour will now appear for users on ${tour.pageUrl || '/'}`,
                                                    duration: 3000
                                                });
                                            } else {
                                                toast.info(`"${tour.title}" deactivated`, {
                                                    duration: 2000
                                                });
                                            }
                                        }}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Behavioral Section */}
                            <div className="bg-secondary/30 rounded-xl p-4 mb-6 border border-border/40">
                                <div className="flex items-center gap-2 mb-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    <Zap className="w-3.5 h-3.5 text-[#E65221]" />
                                    <span>Delivery Control</span>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdownId(openDropdownId === tour.id ? null : tour.id);
                                        }}
                                        className="w-full flex items-center justify-between bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer hover:border-primary/50 transition-colors"
                                    >
                                        <span className="truncate">
                                            {tour.playBehavior === 'first_time' && 'Show once (first visit)'}
                                            {tour.playBehavior === 'weekly' && 'Weekly (2x max)'}
                                            {tour.playBehavior === 'monthly_thrice' && 'Monthly (once a month, 3x max)'}
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-muted-foreground mr-1" />
                                    </button>

                                    {openDropdownId === tour.id && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenDropdownId(null);
                                                }}
                                            />
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-popover text-popover-foreground rounded-lg shadow-md border border-border z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                <div className="p-1">
                                                    {[
                                                        { value: 'first_time', label: 'Show once (first visit)' },
                                                        { value: 'weekly', label: 'Weekly (2x max)' },
                                                        { value: 'monthly_thrice', label: 'Monthly (once a month, 3x max)' }
                                                    ].map((option) => (
                                                        <div
                                                            key={option.value}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                updateTourBehavior(tour.id, option.value as any);
                                                                setOpenDropdownId(null);
                                                            }}
                                                            className={cn(
                                                                "relative flex items-center h-9 px-8 text-sm font-medium rounded-md select-none cursor-pointer transition-colors",
                                                                tour.playBehavior === option.value
                                                                    ? "bg-primary/10 text-primary"
                                                                    : "hover:bg-accent hover:text-accent-foreground"
                                                            )}
                                                        >
                                                            <span className="truncate">{option.label}</span>
                                                            {tour.playBehavior === option.value && (
                                                                <div className="absolute left-2.5 flex items-center justify-center">
                                                                    <Check className="w-4 h-4 text-primary" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <p className="mt-2 text-[10px] text-muted-foreground leading-tight italic">
                                    {tour.playBehavior === 'first_time' && "Guides the user once and then stays hidden."}
                                    {tour.playBehavior === 'weekly' && "Reminds users once a week. Shown up to 2 times total."}
                                    {tour.playBehavior === 'monthly_thrice' && "Recurring monthly check-in. Shown up to 3 times total."}
                                </p>
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
                    </div>
                )}
            </div>

            <DeleteTourDialog
                isOpen={!!deletingTour}
                onClose={() => setDeletingTour(null)}
                onConfirm={handleDelete}
                tourTitle={deletingTour?.title || ""}
            />
        </>
    );
}
