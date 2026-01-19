"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Zap, Layout, Settings, MousePointerClick } from "lucide-react";

const features = [
    {
        id: "smart-detect",
        title: "Smart Element Detection",
        description: "Our engine automatically highlights the elements you click on. No manual cropping or positioning required. It just understands your UI.",
        icon: <Zap className="w-5 h-5" />,
        image: "/features/smart-detect.png", // Placeholder
        color: "bg-blue-500"
    },
    {
        id: "responsive",
        title: "Responsive Player",
        description: "Tours look perfect on any device. Whether your user is on a desktop or mobile, the experience adapts automatically.",
        icon: <Layout className="w-5 h-5" />,
        image: "/features/responsive.png", // Placeholder
        color: "bg-indigo-500"
    },
    {
        id: "visual-editor",
        title: "Visual Editor",
        description: "Drag, drop, and style your steps in real-time. What you see is exactly what your users will get.",
        icon: <MousePointerClick className="w-5 h-5" />,
        image: "/features/editor.png", // Placeholder
        color: "bg-purple-500"
    },
    {
        id: "customization",
        title: "Deep Customization",
        description: "Match your brand guidelines perfectly. Custom CSS, fonts, and colors are all supported out of the box.",
        icon: <Settings className="w-5 h-5" />,
        image: "/features/custom.png", // Placeholder
        color: "bg-pink-500"
    }
];

export function FeatureTabs() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left Side: Tabs */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-4xl md:text-5xl font-bold font-serif mb-8 text-foreground">
                        Precision control <br />
                        <span className="text-primary">without the friction.</span>
                    </h2>

                    <div className="flex flex-col gap-2">
                        {features.map((feature, index) => (
                            <div
                                key={feature.id}
                                onClick={() => setActiveTab(index)}
                                className={cn(
                                    "relative p-6 rounded-2xl cursor-pointer transition-all duration-300",
                                    activeTab === index
                                        ? "bg-secondary"
                                        : "hover:bg-secondary/50"
                                )}
                            >
                                <div className="flex flex-col gap-2">
                                    <h3 className={cn(
                                        "text-xl font-bold transition-colors",
                                        activeTab === index ? "text-primary" : "text-foreground"
                                    )}>
                                        {feature.title}
                                    </h3>

                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Visual */}
                <div className="relative h-[600px] w-full bg-secondary/10 rounded-[2.5rem] border border-border/50 overflow-hidden shadow-2xl p-2 select-none">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="w-full h-full rounded-[2rem] bg-background border border-border/50 flex items-center justify-center relative overflow-hidden shadow-sm"
                        >
                            {/* Abstract Representation of Feature */}
                            <div className="relative z-10 text-center p-10">
                                <div className={cn(
                                    "w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl skew-y-3",
                                    features[activeTab].color
                                )}>
                                    {/* Icon scaled up */}
                                    <div className="scale-[2.5] text-white">
                                        {features[activeTab].icon}
                                    </div>
                                </div>
                                <h4 className="text-3xl font-bold text-foreground mb-4 font-serif">{features[activeTab].title}</h4>
                                <div className="flex gap-2 justify-center">
                                    <div className="w-2 h-2 rounded-full bg-foreground/20 animate-pulse" />
                                    <div className="w-2 h-2 rounded-full bg-foreground/20 animate-pulse delay-75" />
                                    <div className="w-2 h-2 rounded-full bg-foreground/20 animate-pulse delay-150" />
                                </div>
                            </div>

                            {/* Decorative Background Elements */}
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary to-transparent" />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
