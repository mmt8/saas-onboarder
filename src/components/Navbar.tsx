"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTourStore } from "@/store/tour-store";
import { LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export function Navbar() {
    const { user, signOut } = useTourStore();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [mobileMenuOpen]);

    if (user) return null;

    return (
        <>{/* Existing Navbar structure */}
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300",
                    scrolled ? "py-4 md:py-6" : "py-6 md:py-8"
                )}
            >
                {/* 1. Left: Logo (Standalone) */}
                <div className="flex items-center z-50 relative">
                    <Link href="/" className="flex items-center gap-0.5 group">
                        <img src="/logo.svg" alt="Product Tour Logo" className="w-9 h-9 transition-transform group-hover:scale-105" />
                        <span className="font-serif font-bold text-2xl tracking-tight text-foreground hidden md:block ml-1">Product Tour</span>
                    </Link>
                </div>

                {/* 2. Center: Navigation Pill (Desktop Only) */}
                <nav
                    className={cn(
                        "hidden md:flex items-center px-2 h-14 rounded-full transition-all duration-300 border border-black/5 dark:border-white/10 shadow-sm backdrop-blur-xl absolute left-1/2 -translate-x-1/2",
                        "bg-white/50 dark:bg-[#1C1C1E]/70"
                    )}
                >
                    <NavLink href="/#features">Features</NavLink>
                    <NavLink href="/pricing">Pricing</NavLink>
                    <NavLink href="/resources">Resources</NavLink>
                </nav>

                {/* 3. Right: Actions & Mobile Toggle */}
                <div className="flex items-center gap-3 z-50 relative">
                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" className="font-bold text-[15px] text-muted-foreground hover:text-primary">
                                Sign In
                            </Button>
                        </Link>
                        <Button asChild className="px-8 h-14 font-bold text-[15px] shadow-sm flex items-center">
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </div>

                    {/* Mobile Actions (Visible on small screens) */}
                    <div className="flex md:hidden items-center gap-3">
                        <Button asChild size="default" className="rounded-full font-bold text-base px-6">
                            <Link href="/signup">Get Started</Link>
                        </Button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors backdrop-blur-md"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5 text-foreground" />
                            ) : (
                                <Menu className="w-5 h-5 text-foreground" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed inset-0 z-40 bg-background/95 backdrop-blur-3xl pt-24 px-6 md:hidden flex flex-col"
                    >
                        <div className="flex flex-col gap-6 text-center mt-10">
                            <MobileNavLink href="/#features" onClick={() => setMobileMenuOpen(false)}>Features</MobileNavLink>
                            <MobileNavLink href="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</MobileNavLink>
                            <MobileNavLink href="/resources" onClick={() => setMobileMenuOpen(false)}>Resources</MobileNavLink>

                            <div className="h-px bg-border/50 w-full my-4" />

                            {user ? (
                                <button
                                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                                    className="text-2xl font-bold font-serif text-destructive hover:text-destructive/80 transition-colors py-2"
                                >
                                    Sign Out
                                </button>
                            ) : (
                                <MobileNavLink href="/login" onClick={() => setMobileMenuOpen(false)}>Sign In</MobileNavLink>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="px-6 py-2 flex items-center text-[15px] font-bold text-muted-foreground hover:text-primary transition-all hover:bg-primary/10 rounded-full"
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-[15px] font-bold text-foreground hover:text-primary transition-colors py-2"
        >
            {children}
        </Link>
    );
}
