"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTourStore } from "@/store/tour-store";
import { LogOut, User } from "lucide-react";

export function Navbar() {
    const { user, signOut } = useTourStore();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-border/40 bg-background/80 backdrop-blur-md">
            <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20">
                    S
                </div>
                <span className="font-bold text-xl tracking-tight text-foreground">SaaS Onboarder</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
                <Link href="/#features" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Features
                </Link>
                <Link href="/#how-it-works" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                    How it Works
                </Link>
                <Link href="/dashboard" className="text-base font-medium text-primary hover:text-primary/80 transition-colors">
                    Dashboard
                </Link>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
                            <User className="w-4 h-4" />
                            <span className="max-w-[150px] truncate">{user.email}</span>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => signOut()}
                            className="text-muted-foreground hover:text-destructive gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Sign In
                        </Link>
                        <Button asChild className="rounded-full px-6 shadow-lg shadow-primary/20">
                            <Link href="/register">Get Started</Link>
                        </Button>
                    </>
                )}
            </div>
        </nav>
    );
}
