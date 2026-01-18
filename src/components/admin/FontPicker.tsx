"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Check, ChevronDown } from "lucide-react";
import { POPULAR_FONTS } from "@/lib/fonts";
import { cn } from "@/lib/utils";

interface FontPickerProps {
    value: string;
    onChange: (value: string) => void;
}

export function FontPicker({ value, onChange }: FontPickerProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);

    const filteredFonts = POPULAR_FONTS.filter(font =>
        font.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 50); // Limit to 50 for performance

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                onClick={() => setOpen(!open)}
                className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-secondary/30 transition-all font-medium text-foreground"
            >
                <span className="truncate">{value || "Select a font..."}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
            </div>

            {open && (
                <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="p-3 border-b border-border bg-secondary/10 flex items-center gap-2">
                        <Search className="w-4 h-4 text-muted-foreground" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search fonts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-sm w-full font-medium"
                        />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {filteredFonts.length > 0 ? (
                            filteredFonts.map((font) => (
                                <div
                                    key={font}
                                    onClick={() => {
                                        onChange(font);
                                        setOpen(false);
                                        setSearch("");
                                    }}
                                    className={cn(
                                        "flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all",
                                        value === font ? "bg-primary text-primary-foreground" : "hover:bg-secondary/50"
                                    )}
                                >
                                    <span className="text-sm font-medium" style={{ fontFamily: font }}>
                                        {font}
                                    </span>
                                    {value === font && <Check className="w-4 h-4" />}
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No fonts found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
