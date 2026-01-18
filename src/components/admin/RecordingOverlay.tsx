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
            if (target.closest('.admin-toolbar-ignore')) return null;
            if (target.id === 'producttour-host') return null; // Ignore Widget UI


            let current: HTMLElement | null = target;
            while (current && current !== document.body) {
                const tagName = current.tagName.toLowerCase();
                if (['button', 'a', 'input', 'select', 'textarea', 'details', 'summary'].includes(tagName)) {
                    return current;
                }

                const role = current.getAttribute('role');
                if (['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio', 'switch'].includes(role || '')) {
                    return current;
                }

                const style = window.getComputedStyle(current);
                if (style.cursor === 'pointer') {
                    return current;
                }

                current = current.parentElement;
            }

            if (target && target !== document.body) {
                return target;
            }

            return null;
        };

        const handleMouseMove = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive = getInteractiveElement(target);
            setHoveredElement(interactive);
        };

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const interactive = getInteractiveElement(target);

            if (!interactive) return;

            e.preventDefault();
            e.stopPropagation();

            const selector = getUniqueSelector(interactive);

            let content = "";
            if (creationMode === 'voice' && (voiceTranscript || interimVoiceTranscript)) {
                content = (voiceTranscript + " " + interimVoiceTranscript).trim();
                clearVoiceTranscript();
            }

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
    }, [isRecording, addStep, creationMode, voiceTranscript, interimVoiceTranscript, clearVoiceTranscript]);

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
