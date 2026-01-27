"use client";

import { motion } from "framer-motion";

interface PricingToggleProps {
    isAnnual: boolean;
    onChange: (isAnnual: boolean) => void;
    discountLabel: string;
}

export function PricingToggle({ isAnnual, onChange, discountLabel }: PricingToggleProps) {
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
                <button
                    onClick={() => onChange(false)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!isAnnual
                        ? "bg-[#E65221] text-white shadow-md shadow-orange-500/20"
                        : "text-slate-500 hover:text-slate-900"}`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => onChange(true)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${isAnnual
                        ? "bg-[#E65221] text-white shadow-md shadow-orange-500/20"
                        : "text-slate-500 hover:text-slate-900"}`}
                >
                    Annual
                </button>
            </div>
        </div>
    );
}
