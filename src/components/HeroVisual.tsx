"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import Image from "next/image";

interface TooltipProps {
    description: string;
    buttonColor: string;
    buttonText: string;
    className?: string;
    x: string;
    y: string;
    parallaxFactor: number;
    buttonRounded?: string;
}

const Tooltip = ({ description, buttonText, className, x, y, parallaxFactor, variant }:
    { description: string, buttonText: string, className?: string, x: string, y: string, parallaxFactor: number, variant: 'yellow' | 'fuchsia' | 'emerald' }) => {

    const variantStyles = {
        yellow: {
            // Glass (Darkened Theme)
            container: "bg-black/20 backdrop-blur-md border-white/10 text-white shadow-[0_15px_24.5px_rgba(0,0,0,0.24),0_7px_10.5px_rgba(0,0,0,0.15)]",
            text: "text-white/90",
            button: "bg-white/10 text-white hover:bg-white/20 rounded-full"
        },
        fuchsia: {
            // Full Color (Fuchsia)
            container: "bg-[#4a044e] border-fuchsia-500/20 text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]",
            text: "text-white/90",
            button: "bg-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/30 rounded-full"
        },
        emerald: {
            // Solid (Light)
            container: "bg-white border-slate-100 text-slate-900 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)]",
            text: "text-slate-700",
            button: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm rounded-none"
        }
    };

    const style = variantStyles[variant];

    return (
        <motion.div
            style={{
                left: x,
                top: y,
            }}
            className={`absolute z-20 ${className}`}
        >
            <div className={`border rounded-[1.4rem] p-6 min-w-[240px] pointer-events-auto flex flex-col gap-4 text-left transition-all ${style.container}`}>
                <p className={`text-sm leading-relaxed font-medium ${style.text}`}>{description}</p>
                <button
                    className={`px-4 py-2 text-xs font-bold transition-all self-end ${style.button}`}
                >
                    {buttonText}
                </button>
            </div>
        </motion.div>
    );
};

export function HeroVisual() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Mouse Parallax Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    // Moves the background less - Substantially reduced for a more grounded feel
    const bgX = useTransform(smoothX, [-300, 300], [-8, 8]);
    const bgY = useTransform(smoothY, [-300, 300], [-8, 8]);

    // Moves tooltips more - Significantly reduced for stability (85% less)
    const toolX1 = useTransform(smoothX, [-300, 300], [-15, 15]);
    const toolY1 = useTransform(smoothY, [-300, 300], [-15, 15]);

    const toolX2 = useTransform(smoothX, [-300, 300], [12, -12]);
    const toolY2 = useTransform(smoothY, [-300, 300], [12, -12]);

    // Removed Tooltip 3 (Blue)

    const toolX4 = useTransform(smoothX, [-300, 300], [8, -8]);
    const toolY4 = useTransform(smoothY, [-300, 300], [-12, 12]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            mouseX.set(e.clientX - centerX);
            mouseY.set(e.clientY - centerY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div
            ref={containerRef}
            className="w-full max-w-5xl mx-auto relative group mb-20 overflow-hidden md:overflow-visible flex justify-start"
        >
            <div className="w-full aspect-video min-w-[640px] md:min-w-0 md:w-full relative shrink-0">
                {/* Dashboard Background */}
                <motion.div
                    className="w-full h-full relative z-0 rounded-[1.75rem] overflow-hidden border border-black/5 shadow-2xl bg-background"
                >
                    <Image
                        src="/hero-dashboard.png"
                        alt="Financial Dashboard"
                        fill
                        priority
                        unoptimized
                        quality={100}
                        className="object-cover md:object-fill"
                        sizes="(max-width: 768px) 100vw, 1200px"
                    />
                </motion.div>

                {/* Tooltips (Desktop-only Parallax & Responsive Mobile Placement) */}

                {/* 1. Yellow Tooltip - Visible on mobile as we're anchored left */}
                <motion.div style={{ x: toolX1, y: toolY1 }} className="absolute z-20 left-[15%] top-[25%] pointer-events-none">
                    <Tooltip
                        x="0" y="0" parallaxFactor={1.5}
                        description="Sync your bank accounts to track cash flow automatically."
                        buttonText="Next"
                        variant="yellow"
                    />
                </motion.div>

                {/* 2. Fuchsia Tooltip - Pinned to region */}
                <motion.div
                    style={{ x: toolX2, y: toolY2 }}
                    className="absolute z-20 right-[20%] top-[15%] pointer-events-none scale-90 md:scale-100 origin-top-right"
                >
                    <Tooltip
                        x="0" y="0" parallaxFactor={1.8}
                        description="Visualize your monthly revenue trends and forecast growth."
                        buttonText="Finish"
                        variant="fuchsia"
                    />
                </motion.div>

                {/* 4. Green Tooltip - Pinned to region */}
                <motion.div
                    style={{ x: toolX4, y: toolY4 }}
                    className="absolute z-20 right-[25%] bottom-[35%] pointer-events-none scale-90 md:scale-100 origin-bottom-right"
                >
                    <Tooltip
                        x="0" y="0" parallaxFactor={2.0}
                        description="Set up custom alerts for large transactions."
                        buttonText="Next"
                        variant="emerald"
                    />
                </motion.div>
            </div>

            {/* Ambient Background Glows */}
            <motion.div style={{ x: useTransform(bgX, (val) => val * -1.5), y: useTransform(bgY, (val) => val * -1.5) }} className="absolute -z-10 -top-20 -left-20 w-80 h-80 bg-[#E65221]/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            <motion.div style={{ x: useTransform(bgX, (val) => val * 1.5), y: useTransform(bgY, (val) => val * 1.5) }} className="absolute -z-10 -bottom-20 -right-20 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen hidden md:block" />
        </div>
    );
}
