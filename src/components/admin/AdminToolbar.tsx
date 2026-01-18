"use client";

import { useTourStore } from "@/store/tour-store";
import { Button } from "@/components/ui/button";
import { Play, Square, Save, Mic, Pause, MicOff, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { AnimatePresence, motion } from "framer-motion";

export function AdminToolbar() {
    const { isRecording, startRecording, stopRecording, saveTour, recordedSteps, creationMode, setInterimVoiceTranscript, addVoiceTranscript, voiceTranscript, interimVoiceTranscript, language } = useTourStore();
    const [isPaused, setIsPaused] = useState(false);

    const { isListening, startListening, stopListening, transcript, resetTranscript, error } = useSpeechRecognition({
        language,
        onResult: (final, interim) => {
            if (final) addVoiceTranscript(final);
            setInterimVoiceTranscript(interim);
        }
    });

    // Auto-start listening when entering voice mode
    useEffect(() => {
        if (creationMode === 'voice' && !isPaused) {
            startListening();
        } else {
            stopListening();
        }
    }, [creationMode, isPaused, startListening, stopListening]);

    if (!isRecording && recordedSteps.length === 0) {
        return null;
    }

    // For manual mode, we don't show the bottom toolbar anymore as controls are in the side panel
    if (creationMode === 'manual') {
        return null;
    }

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50 w-full max-w-2xl pointer-events-none">
            {/* Transcript Overlay */}
            <AnimatePresence>
                {(voiceTranscript || interimVoiceTranscript) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="glass rounded-2xl p-6 mb-4 max-w-xl text-center shadow-xl pointer-events-auto"
                    >
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Live Transcript</p>
                        <p className="text-lg font-medium text-foreground leading-relaxed">
                            {(voiceTranscript + " " + interimVoiceTranscript).trim() || <span className="text-muted-foreground/50 italic">Start speaking...</span>}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toolbar */}
            {(isRecording || creationMode === 'voice') && (
                <div className="glass rounded-full p-2 flex items-center gap-2 shadow-2xl pointer-events-auto transition-all hover:scale-[1.02] bg-white/80">
                    {/* Recording Indicator */}
                    {isRecording && (
                        <div className="flex items-center gap-3 px-4 border-r border-border/50">
                            <div className={cn(
                                "w-3 h-3 rounded-full transition-colors duration-300",
                                "bg-red-500 animate-pulse"
                            )} />
                            <span className="text-sm font-semibold text-foreground">
                                Recording...
                            </span>
                        </div>
                    )}

                    {/* Controls */}
                    <div className="flex items-center gap-2 px-2">
                        {creationMode === 'voice' && (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsPaused(!isPaused)}
                                    className={cn("rounded-full hover:bg-slate-100 text-foreground", isPaused && "text-yellow-500")}
                                >
                                    {isPaused ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </Button>

                                <Button
                                    onClick={stopRecording}
                                    variant="destructive"
                                    size="icon"
                                    className="rounded-full shadow-lg shadow-red-500/20"
                                >
                                    <Square className="w-4 h-4 fill-current" />
                                </Button>

                                <Button
                                    onClick={() => saveTour("New Tour " + new Date().toLocaleTimeString(), window.location.pathname)}
                                    className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 ml-2"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Finish
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Error Toast */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-2 max-w-md text-center shadow-lg animate-in slide-in-from-bottom-2 pointer-events-auto">
                    <p className="text-red-600 text-sm font-medium flex items-center justify-center gap-2 mb-2">
                        <MicOff className="w-4 h-4" />
                        {error === 'network' ? 'Connection lost. Retrying...' : error}
                    </p>
                    <div className="flex justify-center gap-2">
                        {error === 'network' && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startListening({ isRetry: true })}
                                className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-50"
                            >
                                Retry Microphone
                            </Button>
                        )}

                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => startRecording('manual')}
                            className="h-8 text-xs bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm"
                        >
                            <Keyboard className="w-3 h-3 mr-1" />
                            Switch to Manual
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
