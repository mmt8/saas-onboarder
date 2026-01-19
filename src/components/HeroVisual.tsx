"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface TooltipProps {
    title: string;
    description: string;
    buttonColor: string;
    buttonText: string;
    className?: string;
    x: string;
    y: string;
    parallaxFactor: number;
}

const Tooltip = ({ title, description, buttonColor, buttonText, className, x, y, parallaxFactor }: TooltipProps) => {
    return (
        <motion.div
            style={{
                left: x,
                top: y,
                // These will be driven by the parent's parallax state
            }}
            className={`absolute z-20 ${className}`}
        >
            <div className="bg-white/80 dark:bg-[#1C1C1E]/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl p-4 shadow-2xl min-w-[200px] pointer-events-auto">
                <h4 className="font-bold text-sm mb-1">{title}</h4>
                <p className="text-[11px] text-muted-foreground mb-3 leading-tight">{description}</p>
                <button
                    className={`w-full py-1.5 rounded-lg text-white text-[10px] font-bold shadow-lg transition-transform hover:scale-105 ${buttonColor}`}
                >
                    {buttonText}
                </button>
            </div>
            {/* Tooltip Arrow/Tail */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white/80 dark:bg-[#1C1C1E]/90 border-r border-b border-white/20 dark:border-white/10 rotate-45" />
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

    // Moves the background less
    const bgX = useTransform(smoothX, [-300, 300], [-15, 15]);
    const bgY = useTransform(smoothY, [-300, 300], [-15, 15]);

    // Moves tooltips more
    const toolX1 = useTransform(smoothX, [-300, 300], [-50, 50]);
    const toolY1 = useTransform(smoothY, [-300, 300], [-50, 50]);

    const toolX2 = useTransform(smoothX, [-300, 300], [40, -40]);
    const toolY2 = useTransform(smoothY, [-300, 300], [40, -40]);

    const toolX3 = useTransform(smoothX, [-300, 300], [-30, 30]);
    const toolY3 = useTransform(smoothY, [-300, 300], [60, -60]);

    const toolX4 = useTransform(smoothX, [-300, 300], [20, -20]);
    const toolY4 = useTransform(smoothY, [-300, 300], [-40, 40]);

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
            className="w-full max-w-5xl mx-auto aspect-video relative group perspective-1000 mb-20"
        >
            {/* Dashboard Background */}
            <motion.div
                style={{ x: bgX, y: bgY, rotateX: useTransform(smoothY, [-300, 300], [2, -2]), rotateY: useTransform(smoothX, [-300, 300], [-2, 2]) }}
                className="w-full h-full relative z-0 rounded-[2.5rem] overflow-hidden border border-black/5 shadow-2xl"
            >
                <img
                    src="/brain/a60a2b90-9d4c-47db-a5a7-284b3a03ca1e/financial_dashboard_hero_1768825274256.png"
                    alt="Financial Dashboard"
                    className="w-full h-full object-cover scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </motion.div>

            {/* Tooltips (Foreground Layer) */}

            {/* 1. Yellow Tooltip */}
            <motion.div style={{ x: toolX1, y: toolY1 }} className="absolute z-20 left-[15%] top-[25%] pointer-events-none">
                <Tooltip
                    x="0" y="0" parallaxFactor={1.5}
                    title="Balance Overview"
                    description="Real-time wealth tracking across all assets."
                    buttonColor="bg-yellow-400 hover:bg-yellow-500"
                    buttonText="View Sources"
                />
            </motion.div>

            {/* 2. Fuchsia Tooltip */}
            <motion.div style={{ x: toolX2, y: toolY2 }} className="absolute z-20 right-[20%] top-[15%] pointer-events-none">
                <Tooltip
                    x="0" y="0" parallaxFactor={1.8}
                    title="Growth Analytics"
                    description="Predictive insights for your portfolio."
                    buttonColor="bg-fuchsia-500 hover:bg-fuchsia-600"
                    buttonText="Analyze Deeply"
                />
            </motion.div>

            {/* 3. Blue Tooltip */}
            <motion.div style={{ x: toolX3, y: toolY3 }} className="absolute z-20 left-[45%] bottom-[20%] pointer-events-none">
                <Tooltip
                    x="0" y="0" parallaxFactor={1.2}
                    title="Recent Moves"
                    description="Every transaction accounted for instantly."
                    buttonColor="bg-blue-500 hover:bg-blue-600"
                    buttonText="Full History"
                />
            </motion.div>

            {/* 4. Green Tooltip */}
            <motion.div style={{ x: toolX4, y: toolY4 }} className="absolute z-20 right-[10%] bottom-[35%] pointer-events-none">
                <Tooltip
                    x="0" y="0" parallaxFactor={2.0}
                    title="Alert Center"
                    description="Stay informed on market volatility."
                    buttonColor="bg-emerald-500 hover:bg-emerald-600"
                    buttonText="Set Alerts"
                />
            </motion.div>

            {/* Ambient Background Glows */}
            <div className="absolute -z-10 -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -z-10 -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        </div>
    );
}
