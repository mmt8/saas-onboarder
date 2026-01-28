"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, Copy, ExternalLink, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface InstallationTutorialModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
}

export function InstallationTutorialModal({ isOpen, onClose, projectId }: InstallationTutorialModalProps) {
    const [copied, setCopied] = useState(false);

    const embedCode = `<script 
  src="https://naiuhnzdampxdewizhin.supabase.co/storage/v1/object/public/widgets/embed.js" 
  data-project-id="${projectId}"
  async
></script>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(embedCode);
        setCopied(true);
        toast.success("Code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            />

            <div className="relative bg-card border border-border w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 border-b border-border bg-secondary/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                            <Code2 className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold font-fraunces">Install Product Tour</h2>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">3-Minute Setup</p>
                        </div>
                    </div>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={onClose}
                        className="rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-8 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                            <div className="space-y-1">
                                <h3 className="font-bold">Copy your unique embed code</h3>
                                <p className="text-sm text-muted-foreground">This script connects your website to the Product Tour dashboard.</p>
                            </div>
                        </div>

                        <div className="relative group">
                            <pre className="bg-secondary/30 border border-border rounded-2xl p-6 font-mono text-sm overflow-x-auto text-foreground/80 leading-relaxed">
                                {embedCode}
                            </pre>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCopy}
                                className="absolute top-4 right-4 bg-background"
                            >
                                {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2" />}
                                {copied ? 'Copied' : 'Copy Code'}
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                        <div className="space-y-1">
                            <h3 className="font-bold">Paste into your header</h3>
                            <p className="text-sm text-muted-foreground">Add this script to the <code className="bg-secondary px-1.5 py-0.5 rounded text-primary">&lt;head&gt;</code> section of your website.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                        <div className="space-y-1">
                            <h3 className="font-bold">Verify Connection</h3>
                            <p className="text-sm text-muted-foreground">Once installed, click the "Refresh" button in your dashboard to see the green <span className="text-emerald-500 font-bold">Synced</span> status.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-secondary/10 flex items-center justify-center border-t border-border">
                    <Button
                        onClick={onClose}
                        className="rounded-full px-8 py-6 font-bold text-lg"
                    >
                        Got it, I've installed it!
                    </Button>
                </div>
            </div>
        </div>
    );
}
