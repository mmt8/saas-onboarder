"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRICING_CONFIG } from "@/data/pricing-data";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { PricingToggle } from "./PricingToggle";

interface ProCardProps {
    price: number | string;
    isAnnual: boolean;
    onToggle: (val: boolean) => void;
}

export function ProCard({ price, isAnnual, onToggle }: ProCardProps) {
    const isCustomPrice = typeof price === "string";

    return (
        <div className="relative group">
            {/* Decorative Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-orange-400 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-500" />

            <div className="relative bg-white border border-primary/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden shadow-orange-950/5">
                {/* Glassmorphism Background elements */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col h-full relative z-10">
                    <div className="mb-8">
                        <h3 className="text-3xl font-bold font-serif mb-2 text-slate-900">Pro</h3>
                        <p className="text-slate-500 font-medium">Perfect for growing product teams.</p>
                    </div>

                    <div className="mb-6">
                        <PricingToggle
                            isAnnual={isAnnual}
                            onChange={onToggle}
                            discountLabel={PRICING_CONFIG.discountLabel}
                        />
                    </div>

                    <div className="mb-10">
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 relative">
                            {!isCustomPrice && <span className="text-5xl font-bold tracking-tight text-slate-900">{PRICING_CONFIG.currency}</span>}
                            <span className="text-5xl font-bold tracking-tight text-slate-900">
                                {price}
                            </span>
                            {!isCustomPrice && (
                                <div className="flex items-center gap-2">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={isAnnual ? "annual" : "monthly"}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="text-slate-400 font-medium text-xl"
                                        >
                                            /mo
                                        </motion.span>
                                    </AnimatePresence>

                                    {isAnnual && (
                                        <div className="flex items-center gap-2">
                                            <motion.span
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-[10px] font-black text-[#E65221] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 uppercase tracking-wider h-fit"
                                            >
                                                {PRICING_CONFIG.discountLabel}
                                            </motion.span>
                                            <span className="text-sm text-emerald-600 font-bold whitespace-nowrap">Billed annually</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="w-full rounded-2xl h-14 text-lg shadow-xl mb-12 shadow-primary/20"
                        asChild
                    >
                        <Link href={isCustomPrice ? "mailto:mehmet@producttour.app" : "/signup"}>
                            {isCustomPrice ? "Contact Sales" : "Start 14-day free trial"}
                        </Link>
                    </Button>

                    <div className="space-y-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Everything in Pro:</p>
                        {PRICING_CONFIG.features.map((feature) => (
                            <div key={feature} className="flex gap-3">
                                <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Check className="w-3 h-3" strokeWidth={3} />
                                </div>
                                <span className="text-slate-600 font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
