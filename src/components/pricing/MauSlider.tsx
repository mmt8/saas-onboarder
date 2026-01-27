"use client";

import * as React from "react";
import * as Slider from "@radix-ui/react-slider";
import { PricingTier } from "@/data/pricing-data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MauSliderProps {
    tiers: PricingTier[];
    currentIndex: number;
    onChange: (index: number) => void;
}

export function MauSlider({ tiers, currentIndex, onChange }: MauSliderProps) {
    return (
        <div className="w-full max-w-2xl mx-auto py-12">
            {/* Tier Labels Above Slider */}
            <div className="relative mb-6 h-10 mx-[18px]">
                {tiers.map((tier, idx) => {
                    const isActive = idx === currentIndex;
                    const percent = (idx / (tiers.length - 1)) * 100;
                    return (
                        <button
                            key={tier.mau}
                            onClick={() => onChange(idx)}
                            style={{
                                left: `${percent}%`,
                                transform: "translateX(-50%)"
                            }}
                            className={cn(
                                "absolute flex flex-col items-center group transition-all duration-300",
                                isActive ? "scale-110" : "hover:scale-105"
                            )}
                        >
                            <span className={cn(
                                "text-sm font-bold tracking-tight transition-colors mb-2 whitespace-nowrap",
                                isActive ? "text-[#E65221]" : "text-muted-foreground group-hover:text-foreground"
                            )}>
                                {tier.label}
                            </span>
                            <div className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                isActive ? "bg-[#E65221] scale-150 shadow-[0_0_10px_rgba(230,82,33,0.5)]" : "bg-border group-hover:bg-muted-foreground"
                            )} />
                        </button>
                    );
                })}
            </div>

            {/* Radix UI Slider */}
            <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5 overflow-visible"
                value={[currentIndex]}
                max={tiers.length - 1}
                step={1}
                onValueChange={([val]) => onChange(val)}
            >
                <Slider.Track className="bg-secondary relative grow rounded-full h-2 border border-border/50 mx-[18px]">
                    <Slider.Range className="absolute bg-[#E65221] rounded-full h-full shadow-[0_0_15px_rgba(230,82,33,0.3)]" />
                </Slider.Track>
                <Slider.Thumb
                    className="block w-9 h-9 bg-background border-[5px] border-[#E65221] rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-primary/20 flex items-center justify-center cursor-grab active:cursor-grabbing"
                    aria-label="Monthly Active Users"
                />

                {/* Visual context nodes (ticks on the track) */}
                <div className="absolute inset-0 mx-[18px] flex justify-between items-center pointer-events-none -z-10">
                    {tiers.map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-foreground/10" />
                    ))}
                </div>
            </Slider.Root>

            {/* Selected Value Text */}
            <div className="text-center mt-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="inline-flex flex-col items-center"
                    >
                        <p className="text-muted-foreground font-medium mb-1">Your Monthly Active Users</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-black tracking-tighter text-foreground drop-shadow-sm">
                                {tiers[currentIndex].mau.toLocaleString()}
                            </span>
                            <span className="text-[#E65221] font-bold">MAUs</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
