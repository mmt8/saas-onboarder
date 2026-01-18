"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
    { label: "Tours", href: "/dashboard" },
    { label: "Installation", href: "/dashboard/installation" },
    { label: "Settings", href: "/dashboard/settings" },
];

export function DashboardNav() {
    const pathname = usePathname();

    return (
        <div className="flex bg-secondary/50 p-1 rounded-xl">
            {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={cn(
                            "px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                            isActive
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </div>
    );
}
