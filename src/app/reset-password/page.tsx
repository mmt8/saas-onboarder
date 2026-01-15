"use client";

import { useState } from "react";
import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [localLoading, setLocalLoading] = useState(false);
    const { updatePassword } = useTourStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLocalLoading(true);
        try {
            const { error } = await updatePassword(password);
            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Password updated successfully!");
                router.push("/login");
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
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold font-fraunces mb-3">Set New Password</h1>
                    <p className="text-muted-foreground">Enter your new secure password below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider ml-1">New Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-secondary/30 border border-border rounded-2xl px-5 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider ml-1">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                        Update Password
                    </Button>
                </form>
            </div>
        </div>
    );
}
