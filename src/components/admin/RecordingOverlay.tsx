"use client";

import { useEffect, useState } from "react";
import { useTourStore } from "@/store/tour-store";
import { getUniqueSelector } from "@/lib/dom-utils";
import { AnimatePresence, motion } from "framer-motion";

export function RecordingOverlay() {
    const { isRecording, addStep, creationMode, voiceTranscript, interimVoiceTranscript, clearVoiceTranscript } = useTourStore();
    const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
    const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        if (!isRecording) return;

        const getInteractiveElement = (target: HTMLElement): HTMLElement | null => {
            // 1. Check if it's an ignored element
            if (target.closest('.admin-toolbar-ignore')) return null;

            // 2. Traverse up to find an interactive element
            let current: HTMLElement | null = target;
            while (current && current !== document.body) {
                // Check for interactive tags
                const tagName = current.tagName.toLowerCase();
                if (['button', 'a', 'input', 'select', 'textarea', 'details', 'summary'].includes(tagName)) {
                    return current;
                }

                // Check for interactive roles
                const role = current.getAttribute('role');
                if (['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio', 'switch'].includes(role || '')) {
                    return current;
                }

                // Check for cursor: pointer
                const style = window.getComputedStyle(current);
                if (style.cursor === 'pointer') {
                    return current;
                }

                current = current.parentElement;
            }

            return null;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive = getInteractiveElement(target);
            setHoveredElement(interactive);
        };

        const handleClick = (e: MouseEvent) => {
            if (!hoveredElement) return;
            e.preventDefault();
            e.stopPropagation();

            const selector = getUniqueSelector(hoveredElement);

            // Use voice transcript if available and in voice mode
            let content = "";
            if (creationMode === 'voice' && (voiceTranscript || interimVoiceTranscript)) {
                content = (voiceTranscript + " " + interimVoiceTranscript).trim();
                // Clear transcript after using it
                clearVoiceTranscript();
            }

            // Show pulse effect
            setClickPosition({ x: e.clientX, y: e.clientY });
            setTimeout(() => setClickPosition(null), 1000);

            addStep({
                target: selector,
                content: content,
                action: 'click',
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick, { capture: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick, { capture: true });
        };
    }, [isRecording, addStep, hoveredElement, creationMode, voiceTranscript, interimVoiceTranscript, clearVoiceTranscript]);

    if (!isRecording) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[100]">


            {hoveredElement && (
                <div
                    className="absolute border-2 border-primary bg-primary/10 pointer-events-none transition-all"
                    style={{
                        left: hoveredElement.getBoundingClientRect().left,
                        top: hoveredElement.getBoundingClientRect().top,
                        width: hoveredElement.getBoundingClientRect().width,
                        height: hoveredElement.getBoundingClientRect().height,
                    }}
                />
            )}

            <AnimatePresence>
                {clickPosition && (
                    <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute w-8 h-8 rounded-full border-2 border-red-500 bg-red-500/20"
                        style={{
                            left: clickPosition.x - 16,
                            top: clickPosition.y - 16
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
