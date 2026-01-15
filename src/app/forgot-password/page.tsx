"use client";

import { useState } from "react";
import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [localLoading, setLocalLoading] = useState(false);
    const { resetPassword } = useTourStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalLoading(true);
        try {
            const { error } = await resetPassword(email);
            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Check your email for the reset link!");
            }
        } catch (err: any) {
            toast.error("An unexpected error occurred");
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-secondary/20">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-primary/5 border border-border/50 p-8 md:p-12">
                <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold font-fraunces mb-3">Forgot Password?</h1>
                    <p className="text-muted-foreground">Enter your email and we'll send you a recovery link.</p>
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

                    <Button
                        type="submit"
                        disabled={localLoading}
                        className="w-full py-8 text-xl font-bold bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/20 hover:shadow-sm transition-all active:scale-95"
                    >
                        {localLoading ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : null}
                        Send Reset Link
                    </Button>
                </form>
            </div>
        </div>
    );
}
