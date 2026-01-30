"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { Loader2, Users, Building, MapPin, Clock, Eye, ToggleLeft, ToggleRight, ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const SUPERADMIN_EMAIL = "mehmet@producttour.app";

type CustomerData = {
    id: string;
    email: string;
    full_name: string | null;
    company_name: string | null;
    country: string | null;
    last_login: string | null;
    created_at: string;
    projects: {
        id: string;
        name: string;
        domain: string | null;
        created_at: string;
        tours: {
            id: string;
            title: string;
            is_active: boolean;
            page_url: string;
            impressions: number;
            created_at: string;
        }[] | null;
    }[] | null;
};

export default function SuperadminPage() {
    const router = useRouter();
    const { user, isAuthLoading } = useTourStore();
    const [customers, setCustomers] = useState<CustomerData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());
    const [togglingTour, setTogglingTour] = useState<string | null>(null);

    // Check superadmin access
    useEffect(() => {
        if (!isAuthLoading && user) {
            if (user.email !== SUPERADMIN_EMAIL) {
                toast.error("Unauthorized access");
                router.push("/dashboard");
            }
        }
    }, [user, isAuthLoading, router]);

    // Fetch all customer data
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.rpc('admin_get_all_data');
            if (error) throw error;
            setCustomers(data || []);
        } catch (error: any) {
            console.error("Failed to fetch admin data:", error);
            toast.error("Failed to load data: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email === SUPERADMIN_EMAIL) {
            fetchData();
        }
    }, [user]);

    // Toggle tour active status
    const toggleTourStatus = async (tourId: string, currentStatus: boolean) => {
        setTogglingTour(tourId);
        try {
            const { error } = await supabase.rpc('admin_toggle_tour', {
                tour_id: tourId,
                new_status: !currentStatus
            });
            if (error) throw error;

            // Update local state
            setCustomers(prev => prev.map(customer => ({
                ...customer,
                projects: customer.projects?.map(project => ({
                    ...project,
                    tours: project.tours?.map(tour =>
                        tour.id === tourId ? { ...tour, is_active: !currentStatus } : tour
                    ) || null
                })) || null
            })));

            toast.success(`Tour ${!currentStatus ? 'enabled' : 'disabled'}`);
        } catch (error: any) {
            toast.error("Failed to toggle tour: " + error.message);
        } finally {
            setTogglingTour(null);
        }
    };

    const toggleCustomerExpanded = (customerId: string) => {
        setExpandedCustomers(prev => {
            const next = new Set(prev);
            if (next.has(customerId)) {
                next.delete(customerId);
            } else {
                next.add(customerId);
            }
            return next;
        });
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Never";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Check authorization
    if (isAuthLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || user.email !== SUPERADMIN_EMAIL) {
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-fraunces mb-2">Superadmin Panel</h1>
                    <p className="text-muted-foreground">
                        View and manage all customers ({customers.length} total)
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={fetchData}
                    disabled={isLoading}
                    className="gap-2"
                >
                    <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                    Refresh
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="space-y-3">
                    {customers.map((customer) => {
                        const isExpanded = expandedCustomers.has(customer.id);
                        const totalTours = customer.projects?.reduce((sum, p) => sum + (p.tours?.length || 0), 0) || 0;
                        const activeTours = customer.projects?.reduce((sum, p) =>
                            sum + (p.tours?.filter(t => t.is_active).length || 0), 0) || 0;
                        const totalImpressions = customer.projects?.reduce((sum, p) =>
                            sum + (p.tours?.reduce((tSum, t) => tSum + (t.impressions || 0), 0) || 0), 0) || 0;

                        return (
                            <div
                                key={customer.id}
                                className="bg-card border border-border rounded-xl overflow-hidden"
                            >
                                {/* Customer Header Row */}
                                <div
                                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                                    onClick={() => toggleCustomerExpanded(customer.id)}
                                >
                                    <div className="shrink-0">
                                        {isExpanded ? (
                                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                        ) : (
                                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                        )}
                                    </div>

                                    <div className="flex-1 grid grid-cols-6 gap-4 items-center min-w-0">
                                        {/* Email */}
                                        <div className="col-span-2 truncate">
                                            <div className="font-semibold text-foreground truncate">{customer.email}</div>
                                            <div className="text-xs text-muted-foreground truncate">
                                                {customer.full_name || "No name"}
                                            </div>
                                        </div>

                                        {/* Company */}
                                        <div className="truncate">
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Building className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate">{customer.company_name || "-"}</span>
                                            </div>
                                        </div>

                                        {/* Country */}
                                        <div className="truncate">
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate">{customer.country || "-"}</span>
                                            </div>
                                        </div>

                                        {/* Last Login */}
                                        <div>
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Clock className="w-3.5 h-3.5 shrink-0" />
                                                <span className="truncate">{formatDate(customer.last_login)}</span>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center gap-3 justify-end">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-foreground">{activeTours}/{totalTours}</div>
                                                <div className="text-[10px] uppercase text-muted-foreground">Tours</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-primary">{totalImpressions}</div>
                                                <div className="text-[10px] uppercase text-muted-foreground">Impressions</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content: Projects & Tours */}
                                {isExpanded && (
                                    <div className="border-t border-border bg-secondary/30 p-4 space-y-3">
                                        {customer.projects && customer.projects.length > 0 ? (
                                            customer.projects.map((project) => (
                                                <div key={project.id} className="bg-card rounded-lg border border-border p-3">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                                        <span className="font-semibold">{project.name}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {project.domain || "No domain"}
                                                        </span>
                                                    </div>

                                                    {project.tours && project.tours.length > 0 ? (
                                                        <div className="ml-4 space-y-2">
                                                            {project.tours.map((tour) => (
                                                                <div
                                                                    key={tour.id}
                                                                    className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg"
                                                                >
                                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                toggleTourStatus(tour.id, tour.is_active);
                                                                            }}
                                                                            disabled={togglingTour === tour.id}
                                                                            className="shrink-0"
                                                                        >
                                                                            {togglingTour === tour.id ? (
                                                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                                            ) : tour.is_active ? (
                                                                                <ToggleRight className="w-6 h-6 text-green-500" />
                                                                            ) : (
                                                                                <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                                                                            )}
                                                                        </button>
                                                                        <div className="truncate">
                                                                            <div className="font-medium truncate">{tour.title}</div>
                                                                            <div className="text-xs text-muted-foreground truncate">
                                                                                {tour.page_url}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2 shrink-0">
                                                                        <div className="flex items-center gap-1 text-sm">
                                                                            <Eye className="w-4 h-4 text-muted-foreground" />
                                                                            <span className="font-semibold">{tour.impressions || 0}</span>
                                                                        </div>
                                                                        <span className={cn(
                                                                            "text-xs px-2 py-0.5 rounded-full",
                                                                            tour.is_active
                                                                                ? "bg-green-100 text-green-700"
                                                                                : "bg-gray-100 text-gray-500"
                                                                        )}>
                                                                            {tour.is_active ? "Active" : "Inactive"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="ml-4 text-sm text-muted-foreground italic">
                                                            No tours created
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-sm text-muted-foreground italic">
                                                No projects created
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {customers.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            No customers found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
