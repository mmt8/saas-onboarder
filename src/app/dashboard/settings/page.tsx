"use client";

import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { Settings, Loader2, Layout, X, ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FontPicker } from "@/components/admin/FontPicker";
import { getGoogleFontUrls } from "@/lib/fonts";
import { detectBranding, DetectedBranding } from "@/widget/utils/branding-detector";
import { AlertCircle } from "lucide-react";

function getContrastColor(hexColor: string): 'white' | 'black' {
    try {
        const hex = hexColor.startsWith('#') ? hexColor : '#495BFD';
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'black' : 'white';
    } catch (e) {
        return 'white';
    }
}

export default function SettingsPage() {
    const {
        projects,
        currentProjectId,
        isLoading,
        updateProjectSettings,
    } = useTourStore();

    const currentProject = projects.find(p => p.id === currentProjectId);

    const [projectName, setProjectName] = useState("");
    const [projectDomain, setProjectDomain] = useState("");
    const [autoBranding, setAutoBranding] = useState<DetectedBranding | null>(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detectionFailed, setDetectionFailed] = useState(false);
    const [theme, setTheme] = useState({
        fontFamily: 'Inter',
        darkMode: false,
        primaryColor: '#495BFD',
        borderRadius: '20',
        paddingV: '10',
        paddingH: '20',
        tooltipStyle: 'solid' as 'solid' | 'color' | 'glass' | 'auto',
        tooltipColor: '#E65221'
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

    // Handle Auto Detection Preview
    useEffect(() => {
        if (theme.tooltipStyle === 'auto') {
            setIsDetecting(true);
            setDetectionFailed(false);

            const timer = setTimeout(() => {
                const result = detectBranding();
                if (result) {
                    setAutoBranding(result);
                    setDetectionFailed(false);
                    // Populate theme with detected values to allow customization
                    setTheme(prev => ({
                        ...prev,
                        primaryColor: result.primaryColor,
                        fontFamily: result.fontFamily,
                        borderRadius: result.borderRadius
                    }));
                } else {
                    setDetectionFailed(true);
                    toast.error("Auto-detection failed. Falling back to Solid style.");
                    setTheme(prev => ({ ...prev, tooltipStyle: 'solid' }));
                }
                setIsDetecting(false);
            }, 1200);

            return () => clearTimeout(timer);
        } else {
            setDetectionFailed(false);
            setIsDetecting(false);
        }
    }, [theme.tooltipStyle]);

    useEffect(() => {
        if (currentProject) {
            setProjectName(currentProject.name);
            setProjectDomain(currentProject.domain || "");
            if (currentProject.themeSettings) {
                // @ts-ignore - Supabase types might lag behind
                setTheme({
                    ...currentProject.themeSettings,
                    // Ensure defaults for new fields if they don't exist in DB yet
                    tooltipStyle: (currentProject.themeSettings as any).tooltipStyle || 'solid',
                    tooltipColor: (currentProject.themeSettings as any).tooltipColor || '#E65221'
                });
            }
        }
    }, [currentProject]);

    const handleSaveSettings = async () => {
        if (currentProjectId) {
            await updateProjectSettings(currentProjectId, {
                name: projectName,
                domain: projectDomain,
                themeSettings: theme
            });
            toast.success("Settings saved successfully!");
        }
    };

    // Helper to determine preview styles
    const getPreviewStyle = () => {
        const baseStyle = { fontFamily: theme.fontFamily };

        if (theme.tooltipStyle === 'glass') {
            return {
                ...baseStyle,
                background: 'rgba(15, 15, 15, 0.4)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 30px 60px -20px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
                color: 'white',
                border: '1px solid #ffffff1a',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                lineHeight: '1.5',
                borderRadius: `${theme.borderRadius}px`
            };
        }

        if (theme.tooltipStyle === 'auto') {
            return {
                ...baseStyle,
                backgroundColor: theme.primaryColor || '#495BFD',
                color: getContrastColor(theme.primaryColor || '#495BFD') === 'black' ? '#1a1a1a' : '#fff',
                borderRadius: '24px'
            };
        }

        if (theme.tooltipStyle === 'color') {
            return {
                ...baseStyle,
                backgroundColor: theme.tooltipColor,
                color: 'white',
                border: 'none',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                borderRadius: `${theme.borderRadius}px`
            };
        }

        // Solid (Default)
        return {
            ...baseStyle,
            borderRadius: `${theme.borderRadius}px`
        };
    };

    const getPreviewClassNames = () => {
        if (theme.tooltipStyle === 'auto') {
            return "w-full max-w-[320px] p-6 animate-in zoom-in duration-300 relative z-10 mx-auto";
        }
        if (theme.tooltipStyle === 'glass') {
            return "w-full max-w-[320px] p-6 animate-in zoom-in duration-300 relative z-10 mx-auto overflow-hidden";
        }
        if (theme.tooltipStyle === 'color') {
            return "w-full max-w-[320px] p-6 shadow-xl animate-in zoom-in duration-300 relative z-10 mx-auto overflow-hidden";
        }
        // Solid
        return cn(
            "w-full max-w-[320px] p-6 shadow-2xl border animate-in zoom-in duration-300 relative z-10 mx-auto overflow-hidden",
            theme.darkMode
                ? "bg-[#1e293b] border-slate-700 text-white"
                : "bg-white border-slate-100 text-slate-900"
        );
    };

    const [isHovered, setIsHovered] = useState(false);

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

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Project Domain / Home URL</label>
                        <input
                            type="text"
                            value={projectDomain}
                            onChange={(e) => setProjectDomain(e.target.value)}
                            className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-foreground"
                            placeholder="e.g. http://localhost:3000/earthy-site.html"
                        />
                        <p className="text-[10px] text-muted-foreground ml-1">The URL where the widget is installed. This is where you'll be redirected when creating new tours.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 border-t border-border pt-8 mt-4 pb-2">
                    <div className="p-3 bg-primary/10 rounded-xl">
                        <Layout className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold font-fraunces text-foreground">Styling</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Appearance & Components</p>
                    </div>
                </div>

                {/* Tooltip Style Section */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Tooltip Style</label>
                    <div className="grid grid-cols-4 gap-3">
                        <div
                            onClick={() => setTheme({ ...theme, tooltipStyle: 'solid' })}
                            className={cn(
                                "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-secondary/10",
                                theme.tooltipStyle === 'solid' ? "border-primary bg-primary/5" : "border-border bg-card"
                            )}
                        >
                            <div className={cn("w-full h-8 rounded-lg border shadow-sm", theme.darkMode ? "bg-[#1e293b]" : "bg-white")} />
                            <span className="text-xs font-bold">Solid</span>
                        </div>
                        <div
                            onClick={() => setTheme({ ...theme, tooltipStyle: 'color' })}
                            className={cn(
                                "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-secondary/10",
                                theme.tooltipStyle === 'color' ? "border-primary bg-primary/5" : "border-border bg-card"
                            )}
                        >
                            <div className="w-full h-8 rounded-lg shadow-sm" style={{ backgroundColor: theme.tooltipColor }} />
                            <span className="text-xs font-bold">Full Color</span>
                        </div>
                        <div
                            onClick={() => setTheme({ ...theme, tooltipStyle: 'glass' })}
                            className={cn(
                                "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-secondary/10",
                                theme.tooltipStyle === 'glass' ? "border-primary bg-primary/5" : "border-border bg-card"
                            )}
                        >
                            <div className="w-full h-8 rounded-lg shadow-sm bg-black/20 backdrop-blur-sm border border-white/20" />
                            <span className="text-xs font-bold">Glass</span>
                        </div>
                        <div
                            onClick={() => setTheme({ ...theme, tooltipStyle: 'auto' })}
                            className={cn(
                                "cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all hover:bg-secondary/10",
                                theme.tooltipStyle === 'auto' ? "border-primary bg-primary/5" : "border-border bg-card"
                            )}
                        >
                            <div
                                className="w-full h-8 rounded-lg shadow-sm flex items-center justify-center relative overflow-hidden"
                                style={{
                                    background: `
                                        radial-gradient(at 0% 0%, #ff4d4d 0px, transparent 50%),
                                        radial-gradient(at 100% 0%, #4d79ff 0px, transparent 50%),
                                        radial-gradient(at 100% 100%, #ff4da6 0px, transparent 50%),
                                        radial-gradient(at 0% 100%, #4dff88 0px, transparent 50%),
                                        radial-gradient(at 50% 50%, #ffcc00 0px, transparent 50%)
                                    `,
                                    backgroundSize: '100% 100%'
                                }}
                            >
                                <Sparkles className="w-3.5 h-3.5 text-white drop-shadow-sm animate-pulse" />
                            </div>
                            <span className="text-xs font-bold">Auto</span>
                        </div>
                    </div>

                    {detectionFailed && (
                        <p className="text-[10px] text-rose-500 font-medium px-2 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="w-3 h-3" />
                            Branding detection unavailable for this environment.
                        </p>
                    )}

                    {/* Conditional Color Picker for 'Full Color' */}
                    {theme.tooltipStyle === 'color' && (
                        <div className="animate-in fade-in slide-in-from-top-2 pt-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1 mb-2 block">Background Color</label>
                            <div className="flex gap-3">
                                <input
                                    type="color"
                                    value={theme.tooltipColor}
                                    onChange={(e) => setTheme({ ...theme, tooltipColor: e.target.value })}
                                    className="w-12 h-12 rounded-xl border-none p-0 bg-transparent cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={theme.tooltipColor}
                                    onChange={(e) => setTheme({ ...theme, tooltipColor: e.target.value })}
                                    className="flex-1 bg-secondary/20 border border-border rounded-xl px-4 py-3 font-mono text-sm text-foreground"
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Theme Mode - Enabled for Auto too */}
                    {theme.tooltipStyle !== 'color' && theme.tooltipStyle !== 'glass' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Theme Mode</label>
                            <div className="relative">
                                <select
                                    value={theme.darkMode ? "dark" : "light"}
                                    onChange={(e) => setTheme({ ...theme, darkMode: e.target.value === "dark" })}
                                    className="w-full bg-secondary/20 border border-border rounded-xl px-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-foreground appearance-none cursor-pointer"
                                >
                                    <option value="light">Light Mode</option>
                                    <option value="dark">Dark Mode</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>
                    )}

                    {/* Font Family - Use Custom FontPicker */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Font Family</label>
                        <FontPicker
                            value={theme.fontFamily}
                            onChange={(val) => setTheme({ ...theme, fontFamily: val })}
                        />
                    </div>

                    {/* Primary Color - Enabled for Auto too */}
                    {(theme.tooltipStyle === 'solid' || theme.tooltipStyle === 'auto') && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
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
                    )}

                    {/* Border Radius */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Button Radius</label>
                        <input
                            type="number"
                            min="0"
                            value={theme.borderRadius}
                            onChange={(e) => setTheme({ ...theme, borderRadius: e.target.value })}
                            className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 font-mono text-foreground"
                        />
                    </div>

                    {/* Padding Vertical */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Button Height</label>
                        <input
                            type="number"
                            min="0"
                            value={theme.paddingV}
                            onChange={(e) => setTheme({ ...theme, paddingV: e.target.value })}
                            className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 font-mono text-foreground"
                        />
                    </div>

                    {/* Padding Horizontal */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Button Width</label>
                        <input
                            type="number"
                            min="0"
                            value={theme.paddingH}
                            onChange={(e) => setTheme({ ...theme, paddingH: e.target.value })}
                            className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 font-mono text-foreground"
                        />
                    </div>
                </div>

                <Button
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                    className="px-8 h-11 text-sm font-bold"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save Settings
                </Button>

                <div className="pt-10 mt-10 border-t border-border space-y-4">
                    <div className="flex items-center gap-2 text-rose-500">
                        <X className="w-5 h-5" />
                        <h4 className="font-bold text-sm uppercase tracking-widest">Danger Zone</h4>
                    </div>
                    <div className="p-6 border border-border rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="font-bold text-foreground">Delete Project</p>
                            <p className="text-sm text-muted-foreground">This will permanently remove all tours and project data. This action cannot be undone.</p>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={async () => {
                                if (confirm("Are you sure you want to delete this project? This action is irreversible.")) {
                                    const { deleteProject } = useTourStore.getState();
                                    if (currentProjectId) {
                                        await deleteProject(currentProjectId);
                                        window.location.href = '/dashboard';
                                    }
                                }
                            }}
                            className="rounded-full px-6 font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-600 active:bg-rose-100 active:text-rose-600 transition-colors"
                        >
                            Delete Project
                        </Button>
                    </div>
                </div>
            </div>

            {/* Compact Right Side Preview - Just slightly bigger than tooltip */}
            <div className="sticky top-0 space-y-4 flex-1 h-full min-h-[600px]">
                <div
                    className="relative p-12 rounded-3xl border border-border shadow-md transition-colors duration-500 bg-slate-400 min-h-[550px] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Floating Label Inside */}
                    <h4 className="absolute top-8 left-10 text-xs font-bold text-white uppercase tracking-[0.3em] z-20">
                        Live Preview
                    </h4>

                    {/* Background Pattern for Preview Contrast */}
                    <div className="absolute inset-0 opacity-70 pointer-events-none rounded-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#a78bfa,transparent)]" />
                        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] animate-spin-slower" style={{ background: 'conic-gradient(from 0deg, transparent 0 340deg, #fff 360deg)', opacity: 0.1 }} />
                        <div
                            className="absolute inset-0 transition-all duration-1000"
                            style={{
                                backgroundColor: isDetecting ? 'transparent' : (autoBranding?.backgroundColor || 'transparent'),
                                opacity: isDetecting ? 0 : (autoBranding?.backgroundColor ? 1 : 0)
                            }}
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: `
                                    radial-gradient(at 27% 37%, hsla(215, 98%, 61%, 1) 0px, transparent 50%),
                                    radial-gradient(at 97% 21%, hsla(125, 98%, 72%, 1) 0px, transparent 50%),
                                    radial-gradient(at 52% 99%, hsla(354, 98%, 61%, 1) 0px, transparent 50%),
                                    radial-gradient(at 10% 29%, hsla(256, 96%, 67%, 1) 0px, transparent 50%),
                                    radial-gradient(at 97% 96%, hsla(38, 60%, 74%, 1) 0px, transparent 50%),
                                    radial-gradient(at 33% 50%, hsla(222, 67%, 73%, 1) 0px, transparent 50%),
                                    radial-gradient(at 79% 53%, hsla(343, 68%, 79%, 1) 0px, transparent 50%)
                                `,
                                filter: 'blur(40px)',
                                opacity: autoBranding?.backgroundColor ? 0.3 : 0.8
                            }}
                        />
                    </div>

                    {/* Mock Tooltip */}
                    {isDetecting ? (
                        <div className="flex flex-col items-center justify-center gap-4 animate-in fade-in zoom-in duration-500 relative z-10">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-white animate-spin" />
                                <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-white/30 animate-spin-slow" />
                                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-white animate-pulse" />
                            </div>
                            <p className="text-white font-bold text-sm tracking-widest uppercase">Detecting Brand...</p>
                        </div>
                    ) : (
                        <div
                            className={getPreviewClassNames()}
                            style={getPreviewStyle()}
                        >
                            <div className="flex items-start justify-end -mr-2 -mt-2 mb-2">
                                <div className={cn("h-6 w-6 rounded-full flex items-center justify-center",
                                    theme.tooltipStyle === 'glass' ? "hover:bg-white/10 text-white" : "hover:bg-black/5 text-muted-foreground"
                                )}>
                                    <X className="w-4 h-4" />
                                </div>
                            </div>

                            <p className="text-sm mb-6 leading-relaxed">
                                This is how your product tours will look to users with your current branding.
                            </p>

                            <div className="flex justify-end items-center gap-4">
                                <span className={cn("text-[10px] font-bold uppercase tracking-widest",
                                    theme.tooltipStyle === 'glass' ? "text-white/40" : "text-muted-foreground/40"
                                )}>
                                    1 of 3
                                </span>
                                <button
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    className={cn(
                                        "text-sm font-bold shadow-sm active:scale-[0.985] transition-all outline-none active:bg-black/10 [backface-visibility:hidden] transform-gpu",
                                        theme.tooltipStyle === 'glass' ? "hover:bg-white/10" : "hover:bg-black/5"
                                    )}
                                    style={{
                                        backgroundColor: theme.tooltipStyle === 'solid' ? theme.primaryColor :
                                            (theme.tooltipStyle === 'glass' ?
                                                (isHovered ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.1)') :
                                                (isHovered ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.1)')),
                                        color: 'white',
                                        borderRadius: `${theme.borderRadius}px`,
                                        padding: `${theme.paddingV}px ${theme.paddingH}px`,
                                        fontSize: theme.tooltipStyle === 'glass' ? '0.8rem' : '0.9rem',
                                        border: theme.tooltipStyle === 'glass' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                                        fontFamily: theme.fontFamily
                                    }}
                                >
                                    Next Step
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
