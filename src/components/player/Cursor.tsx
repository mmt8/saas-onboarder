"use client";

import { motion } from "framer-motion";
import { MousePointer2 } from "lucide-react";

interface CursorProps {
    x: number;
    y: number;
}

export function Cursor({ x, y }: CursorProps) {
    return (
        <motion.div
            className="fixed pointer-events-none z-[100] drop-shadow-2xl"
            animate={{ x, y }}
            transition={{
                type: "spring",
                damping: 30,
                stiffness: 200,
                mass: 0.8,
            }}
            initial={false}
        >
            <MousePointer2 className="w-8 h-8 text-primary fill-primary/20 -rotate-12" />
            <div className="absolute top-full left-full mt-2 ml-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-ping opacity-75" />
            </div>
        </motion.div>
    );
}
