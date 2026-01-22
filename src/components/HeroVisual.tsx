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

const Tooltip = ({ description, buttonText, className, x, y, parallaxFactor, variant, buttonRounded = "rounded-3xl" }:
    { description: string, buttonText: string, className?: string, x: string, y: string, parallaxFactor: number, variant: 'yellow' | 'fuchsia' | 'emerald', buttonRounded?: string }) => {

    const variantStyles = {
        yellow: {
            bg: "bg-[#422006]", // Deep Yellow/Brown (Darker than button)
            text: "text-yellow-400",
            border: "border-yellow-500/20"
        },
        fuchsia: {
            bg: "bg-[#4a044e]", // Deep Fuchsia
            text: "text-fuchsia-400",
            border: "border-fuchsia-500/20"
        },
        emerald: {
            bg: "bg-[#064e3b]", // Deep Emerald
            text: "text-emerald-400",
            border: "border-emerald-500/20"
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
            <div className={`${style.bg} ${style.border} border backdrop-blur-md rounded-[1.4rem] p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] min-w-[240px] pointer-events-auto flex flex-col gap-4 text-left transition-transform hover:scale-[1.02]`}>
                <p className="text-sm text-white/90 leading-relaxed font-medium">{description}</p>
                <button
                    className={`px-0 py-0 text-sm font-bold transition-opacity hover:opacity-80 self-end ${style.text}`}
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

    // Moves the background less
    const bgX = useTransform(smoothX, [-300, 300], [-15, 15]);
    const bgY = useTransform(smoothY, [-300, 300], [-15, 15]);

    // Moves tooltips more
    const toolX1 = useTransform(smoothX, [-300, 300], [-50, 50]);
    const toolY1 = useTransform(smoothY, [-300, 300], [-50, 50]);

    const toolX2 = useTransform(smoothX, [-300, 300], [40, -40]);
    const toolY2 = useTransform(smoothY, [-300, 300], [40, -40]);

    // Removed Tooltip 3 (Blue)

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
            className="w-full max-w-5xl mx-auto aspect-video relative group mb-20"
        >
            {/* Dashboard Background */}
            <motion.div
                className="w-full h-full relative z-0 rounded-[2.5rem] overflow-hidden border border-black/5 shadow-2xl"
            >
                <Image
                    src="/hero-dashboard.png"
                    alt="Financial Dashboard"
                    fill
                    priority
                    unoptimized
                    quality={100}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1200px"
                />
            </motion.div>

            {/* Tooltips (Foreground Layer) */}

            {/* 1. Yellow Tooltip - Rectangle */}
            <motion.div style={{ x: toolX1, y: toolY1 }} className="absolute z-20 left-[15%] top-[25%] pointer-events-none">
                <Tooltip
                    x="0" y="0" parallaxFactor={1.5}
                    description="Sync your bank accounts to track cash flow automatically."
                    buttonText="Next"
                    variant="yellow"
                />
            </motion.div>

            {/* 2. Fuchsia Tooltip - Rounded Rect */}
            <motion.div style={{ x: toolX2, y: toolY2 }} className="absolute z-20 right-[20%] top-[15%] pointer-events-none">
                <Tooltip
                    x="0" y="0" parallaxFactor={1.8}
                    description="Visualize your monthly revenue trends and forecast growth."
                    buttonText="Finish"
                    variant="fuchsia"
                />
            </motion.div>

            {/* 4. Green Tooltip - Rounded (4px) - Moved Left by ~80px (right 10% -> 25%) */}
            <motion.div style={{ x: toolX4, y: toolY4 }} className="absolute z-20 right-[25%] bottom-[35%] pointer-events-none">
                <Tooltip
                    x="0" y="0" parallaxFactor={2.0}
                    description="Set up custom alerts for large transactions."
                    buttonText="Next"
                    variant="emerald"
                />
            </motion.div>

            {/* Ambient Background Glows */}
            <motion.div style={{ x: useTransform(bgX, (val) => val * -1.5), y: useTransform(bgY, (val) => val * -1.5) }} className="absolute -z-10 -top-20 -left-20 w-80 h-80 bg-[#E65221]/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
            <motion.div style={{ x: useTransform(bgX, (val) => val * 1.5), y: useTransform(bgY, (val) => val * 1.5) }} className="absolute -z-10 -bottom-20 -right-20 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
        </div>
    );
}
