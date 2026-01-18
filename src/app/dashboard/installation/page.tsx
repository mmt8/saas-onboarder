"use client";

import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { Code, Copy } from "lucide-react";

export default function InstallationPage() {
    const { currentProjectId } = useTourStore();

    const embedCode = `<script
  id="producttour-embed"
  src="https://naiuhnzdampxdewizhin.supabase.co/storage/v1/object/public/widgets/embed.js"
  data-project-id="${currentProjectId || 'YOUR_PROJECT_ID'}"
  async
></script>`;

    return (
        <div className="p-8 border-dashed border-2 border-border bg-secondary/30 rounded-2xl">
            <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="p-4 bg-primary/10 rounded-2xl">
                    <Code className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3 font-fraunces">Embed Product Tour</h3>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Copy and paste this script tag into the <code className="bg-secondary px-2 py-1 rounded text-foreground font-mono text-sm">&lt;head&gt;</code> of your website.
                    </p>

                    <div className="relative group">
                        <pre className="bg-card border border-border p-6 rounded-2xl overflow-x-auto font-mono text-sm text-foreground shadow-inner">
                            {embedCode}
                        </pre>
                        <Button
                            size="icon"
                            variant="outline"
                            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background shadow-sm"
                            onClick={() => {
                                navigator.clipboard.writeText(embedCode);
                                alert("Script copied to clipboard!");
                            }}
                        >
                            <Copy className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
