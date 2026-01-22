"use client";

import { useState } from "react";
import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";

interface CreateProjectDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateProjectDialog({ isOpen, onClose }: CreateProjectDialogProps) {
    const [name, setName] = useState("");
    const [domain, setDomain] = useState("");
    const [localLoading, setLocalLoading] = useState(false);
    const { createProject } = useTourStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        setLocalLoading(true);
        try {
            const { error } = await createProject(name, domain);
            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Project created! Let's build some tours.");
                onClose();
            }
        } catch (err: any) {
            toast.error("Failed to create project");
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="mb-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-4xl font-bold font-fraunces mb-3">New Project</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                    Give your project a name to get started. You can add your domain later.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Project Name</label>
                    <input
                        type="text"
                        required
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. My Awesome SaaS"
                        className="w-full bg-secondary/30 border border-border rounded-2xl px-6 py-5 text-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Domain (Optional)</label>
                    <input
                        type="text"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="e.g. app.example.com"
                        className="w-full bg-secondary/30 border border-border rounded-2xl px-6 py-5 text-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={localLoading || !name}
                    className="w-full py-10 text-2xl font-bold rounded-2xl group"
                >
                    {localLoading ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : null}
                    Create Project
                </Button>
            </form>
        </Modal>
    );
}
