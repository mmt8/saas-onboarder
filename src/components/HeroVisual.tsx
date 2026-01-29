"use client";

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
            container: "bg-black/20 backdrop-blur-md border-white/10 text-white shadow-[0_15px_24.5px_rgba(0,0,0,0.24),0_7px_10.5px_rgba(0,0,0,0.15)]",
            text: "text-white/90",
            button: "bg-white/10 text-white hover:bg-white/20 rounded-full"
        },
        fuchsia: {
            container: "bg-[#4a044e] border-fuchsia-500/20 text-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]",
            text: "text-white/90",
            button: "bg-fuchsia-500/20 text-fuchsia-400 hover:bg-fuchsia-500/30 rounded-full"
        },
        emerald: {
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
    const [activeTooltipIndex, setActiveTooltipIndex] = useState(0);

    const tooltipsData = [
        {
            description: "Sync your bank accounts to track cash flow automatically.",
            buttonText: "Next",
            variant: "yellow" as const
        },
        {
            description: "Visualize your monthly revenue trends and forecast growth.",
            buttonText: "Finish",
            variant: "fuchsia" as const
        },
        {
            description: "Set up custom alerts for large transactions.",
            buttonText: "Next",
            variant: "emerald" as const
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTooltipIndex((prev) => (prev + 1) % tooltipsData.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Mouse Parallax Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    const bgX = useTransform(smoothX, [-300, 300], [-8, 8]);
    const bgY = useTransform(smoothY, [-300, 300], [-8, 8]);

    const toolX1 = useTransform(smoothX, [-300, 300], [-15, 15]);
    const toolY1 = useTransform(smoothY, [-300, 300], [-15, 15]);

    const toolX2 = useTransform(smoothX, [-300, 300], [12, -12]);
    const toolY2 = useTransform(smoothY, [-300, 300], [12, -12]);

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
                    className="w-full h-full relative z-0 md:rounded-[1.75rem] rounded-tr-[1.75rem] rounded-br-[1.75rem] overflow-hidden border border-black/5 shadow-2xl bg-background"
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

                {/* Desktop Tooltips (Fixed Regions) */}
                <div className="hidden md:block">
                    <motion.div style={{ x: toolX1, y: toolY1 }} className="absolute z-20 left-[15%] top-[25%] pointer-events-none">
                        <Tooltip
                            x="0" y="0" parallaxFactor={1.5}
                            description={tooltipsData[0].description}
                            buttonText={tooltipsData[0].buttonText}
                            variant={tooltipsData[0].variant}
                        />
                    </motion.div>

                    <motion.div
                        style={{ x: toolX2, y: toolY2 }}
                        className="absolute z-20 right-[20%] top-[15%] pointer-events-none scale-90 md:scale-100 origin-top-right"
                    >
                        <Tooltip
                            x="0" y="0" parallaxFactor={1.8}
                            description={tooltipsData[1].description}
                            buttonText={tooltipsData[1].buttonText}
                            variant={tooltipsData[1].variant}
                        />
                    </motion.div>

                    <motion.div
                        style={{ x: toolX4, y: toolY4 }}
                        className="absolute z-20 right-[25%] bottom-[35%] pointer-events-none scale-90 md:scale-100 origin-bottom-right"
                    >
                        <Tooltip
                            x="0" y="0" parallaxFactor={2.0}
                            description={tooltipsData[2].description}
                            buttonText={tooltipsData[2].buttonText}
                            variant={tooltipsData[2].variant}
                        />
                    </motion.div>
                </div>

                {/* Mobile Rotating Tooltips (Unified Location) */}
                <div className="md:hidden absolute z-20 left-[15%] top-[25%] pointer-events-none">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTooltipIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Tooltip
                                x="0" y="0" parallaxFactor={1.5}
                                description={tooltipsData[activeTooltipIndex].description}
                                buttonText={tooltipsData[activeTooltipIndex].buttonText}
                                variant={tooltipsData[activeTooltipIndex].variant}
                                className="scale-90 origin-top-left"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Ambient Background Glows */}
            <motion.div style={{ x: useTransform(bgX, (val) => val * -1.5), y: useTransform(bgY, (val) => val * -1.5) }} className="absolute -z-10 -top-20 -left-20 w-80 h-80 bg-[#E65221]/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            <motion.div style={{ x: useTransform(bgX, (val) => val * 1.5), y: useTransform(bgY, (val) => val * 1.5) }} className="absolute -z-10 bottom-10 -right-20 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen hidden md:block" />
        </div>
    );
}
