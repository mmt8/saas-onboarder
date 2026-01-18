"use client";

import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { Settings, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FontPicker } from "@/components/admin/FontPicker";
import { getGoogleFontUrls } from "@/lib/fonts";

export default function SettingsPage() {
    const {
        projects,
        currentProjectId,
        isLoading,
        updateProjectSettings,
    } = useTourStore();

    const currentProject = projects.find(p => p.id === currentProjectId);

    const [projectName, setProjectName] = useState("");
    const [theme, setTheme] = useState({
        fontFamily: 'Inter',
        darkMode: false,
        primaryColor: '#495BFD',
        borderRadius: '12',
        paddingV: '10',
        paddingH: '20'
    });

    // Dynamically load the font for preview
    useEffect(() => {
        if (theme.fontFamily) {
            const linkId = 'preview-font-link';
            let link = document.getElementById(linkId) as HTMLLinkElement;
            if (!link) {
                link = document.createElement('link');
                link.id = linkId;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
            }
            link.href = getGoogleFontUrls(theme.fontFamily);
        }
    }, [theme.fontFamily]);

    useEffect(() => {
        if (currentProject) {
            setProjectName(currentProject.name);
            if (currentProject.themeSettings) {
                setTheme(currentProject.themeSettings);
            }
        }
    }, [currentProject]);

    const handleSaveSettings = async () => {
        if (currentProjectId) {
            await updateProjectSettings(currentProjectId, {
                name: projectName,
                themeSettings: theme
            });
            toast.success("Settings saved successfully!");
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Customization Controls - Half Width (capped at 50% on md+) */}
            <div className="flex-1 w-full md:max-w-[50%] bg-card border border-border rounded-3xl p-8 space-y-8 shadow-sm">
                <div className="flex items-center gap-4 border-b border-border pb-6 mb-6">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Settings className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold font-fraunces text-foreground">Project Settings</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Branding & Identity</p>
                    </div>
                </div>

                {/* Project Identity Section */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Project Name</label>
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-foreground"
                            placeholder="e.g. My Website"
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Font Family - Use Custom FontPicker */}
                    <div className="space-y-3 col-span-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Font Family</label>
                        <FontPicker
                            value={theme.fontFamily}
                            onChange={(val) => setTheme({ ...theme, fontFamily: val })}
                        />
                    </div>

                    {/* Dark Mode */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Theme Mode</label>
                        <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-xl border border-border/50">
                            <span className="text-sm font-medium text-foreground">Dark Theme</span>
                            <div
                                onClick={() => setTheme({ ...theme, darkMode: !theme.darkMode })}
                                className={cn(
                                    "w-12 h-6 rounded-full transition-colors cursor-pointer relative",
                                    theme.darkMode ? "bg-primary" : "bg-slate-300"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                    theme.darkMode ? "left-7" : "left-1"
                                )} />
                            </div>
                        </div>
                    </div>

                    {/* Primary Color */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Button Color</label>
                        <div className="flex gap-3">
                            <input
                                type="color"
                                value={theme.primaryColor}
                                onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                                className="w-12 h-12 rounded-xl border-none p-0 bg-transparent cursor-pointer"
                            />
                            <input
                                type="text"
                                value={theme.primaryColor}
                                onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                                className="flex-1 bg-secondary/20 border border-border rounded-xl px-4 py-3 font-mono text-sm text-foreground"
                            />
                        </div>
                    </div>

                    {/* Border Radius */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Button Radius (px)</label>
                        <input
                            type="number"
                            value={theme.borderRadius}
                            onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })}
                            className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 font-mono text-foreground"
                        />
                    </div>

                    {/* Padding Vertical */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Button Padding V (px)</label>
                        <input
                            type="number"
                            value={theme.paddingV}
                            onChange={(e) => setTheme({ ...theme, paddingV: e.target.value })}
                            className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 font-mono text-foreground"
                        />
                    </div>

                    {/* Padding Horizontal */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Button Padding H (px)</label>
                        <input
                            type="number"
                            value={theme.paddingH}
                            onChange={(e) => setTheme({ ...theme, paddingH: e.target.value })}
                            className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 font-mono text-foreground"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                    className="w-full py-8 text-xl font-bold bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/20 hover:shadow-sm transition-all active:scale-95"
                >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : null}
                    Save Project Settings
                </Button>
            </div>

            {/* Compact Right Side Preview - Just slightly bigger than tooltip */}
            <div className="sticky top-8 space-y-4 flex-1">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Live Preview</h4>

                <div
                    className={cn(
                        "relative p-8 rounded-3xl border border-border shadow-md transition-colors duration-500",
                        theme.darkMode ? "bg-[#0f172a]" : "bg-slate-50"
                    )}
                >
                    {/* Mock Tooltip - Original Size (320px max) */}
                    <div
                        className={cn(
                            "w-full max-w-[320px] p-6 rounded-2xl shadow-2xl border animate-in zoom-in duration-300 relative z-10 mx-auto",
                            theme.darkMode
                                ? "bg-[#1e293b] border-slate-700 text-white"
                                : "bg-white border-slate-100 text-slate-900"
                        )}
                        style={{ fontFamily: theme.fontFamily }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                                style={{ backgroundColor: theme.primaryColor, color: '#fff' }}>1</span>
                            <span className={cn("text-xs", theme.darkMode ? "opacity-60" : "opacity-40")}>Preview Step</span>
                        </div>

                        <p className="text-sm mb-6 leading-relaxed">
                            This is how your product tours will look to users with your current branding.
                        </p>

                        <div className="flex justify-end">
                            <button
                                className="text-sm font-bold shadow-sm hover:brightness-110 active:scale-95 transition-all text-white"
                                style={{
                                    backgroundColor: theme.primaryColor,
                                    borderRadius: `${theme.borderRadius}px`,
                                    padding: `${theme.paddingV}px ${theme.paddingH}px`
                                }}
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
