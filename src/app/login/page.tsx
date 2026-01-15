"use client";

import { useEffect, useState } from "react";
import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [localLoading, setLocalLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const { signIn, signInWithGoogle, user, isAuthLoading } = useTourStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthLoading && user) {
            router.push("/dashboard");
        }
    }, [user, router, isAuthLoading]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalLoading(true);
        try {
            const { error } = await signIn(email, password);
            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Welcome back!");
                router.refresh();
                router.replace("/dashboard");
            }
        } catch (err: any) {
            toast.error("An unexpected error occurred");
        } finally {
            setLocalLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            const { error } = await signInWithGoogle();
            if (error) toast.error(error.message);
        } catch (err: any) {
            toast.error("Failed to connect to Google");
        } finally {
            setGoogleLoading(false);
        }
    };

    if (isAuthLoading) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-secondary/20">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-secondary/20">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-primary/5 border border-border/50 p-8 md:p-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold font-fraunces mb-3">Welcome Back</h1>
                    <p className="text-muted-foreground">Sign in to manage your product tours.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider ml-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="hello@example.com"
                            className="w-full bg-secondary/30 border border-border rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Password</label>
                            <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">
                                Forgot?
                            </Link>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-secondary/30 border border-border rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={localLoading}
                        className="w-full py-8 text-xl font-bold bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/20 hover:shadow-sm transition-all active:scale-95"
                    >
                        {localLoading ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : null}
                        Sign In
                    </Button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border/60"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase font-bold">
                        <span className="bg-white px-4 text-muted-foreground tracking-widest">Or continue with</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    disabled={googleLoading}
                    onClick={handleGoogleSignIn}
                    className="w-full py-8 text-lg font-bold border-border rounded-2xl hover:bg-secondary/30 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                    {googleLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                            />
                        </svg>
                    )}
                    Google
                </Button>

                <div className="mt-10 text-center">
                    <p className="text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-primary font-bold hover:underline">
                            Create one for free
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
