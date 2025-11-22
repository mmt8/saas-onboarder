"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechRecognitionProps {
    onResult?: (final: string, interim: string) => void;
    onError?: (error: any) => void;
    language?: string;
}

export function useSpeechRecognition({ onResult, onError, language = 'en-US' }: UseSpeechRecognitionProps = {}) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    const recognitionRef = useRef<any>(null);
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);

    // We need to define these refs to access the latest functions in the initialize callback
    // without creating a dependency loop
    const onResultRef = useRef(onResult);
    const onErrorRef = useRef(onError);
    const isListeningRef = useRef(isListening);
    const errorRef = useRef(error);

    // New refs for smart retry logic
    const retryCountRef = useRef(0);
    const didErrorRef = useRef(false);

    useEffect(() => {
        onResultRef.current = onResult;
        onErrorRef.current = onError;
        isListeningRef.current = isListening;
        errorRef.current = error;
    }, [onResult, onError, isListening, error]);

    // Forward declaration for the retry logic
    const startListeningRef = useRef<(options?: { isRetry?: boolean }) => void>(() => { });

    const initializeRecognition = useCallback(() => {
        if (typeof window === 'undefined' || !('webkitSpeechRecognition' in window)) return null;

        // @ts-ignore
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = false; // Manual continuous for stability
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onstart = () => {
            if (!isMountedRef.current) return;
            console.log("Speech recognition started");
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            if (!isMountedRef.current) return;

            // Successful result resets retry count
            retryCountRef.current = 0;
            setError(null);

            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            const currentText = finalTranscript + interimTranscript;
            setTranscript(currentText);
            if (onResultRef.current) onResultRef.current(finalTranscript, interimTranscript);
        };

        recognition.onerror = (event: any) => {
            if (!isMountedRef.current) return;
            didErrorRef.current = true;

            // Ignore 'no-speech' errors as they just mean silence
            if (event.error === 'no-speech') {
                return;
            }

            console.error('Speech recognition error', event.error);

            // Aggressively abort the instance on error to clear state
            try {
                event.target?.abort();
            } catch (e) {
                // Ignore abort errors
            }

            if (event.error === 'network') {
                if (retryCountRef.current < 3) {
                    retryCountRef.current += 1;
                    console.log(`Network error. Retry attempt ${retryCountRef.current}/3`);
                    setError('network'); // Keep showing network error while retrying

                    // Kill current instance
                    setIsListening(false);
                    recognitionRef.current = null;

                    // Retry with increased backoff (2s, 4s, 6s)
                    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
                    retryTimeoutRef.current = setTimeout(() => {
                        if (!isMountedRef.current) return;
                        startListeningRef.current({ isRetry: true });
                    }, 2000 * retryCountRef.current);
                } else {
                    console.error("Max retries reached. Stopping.");
                    setError('Connection failed. Please check your internet.');
                    setIsListening(false);
                    recognitionRef.current = null;
                }
            } else {
                setError(event.error);
                if (onErrorRef.current) onErrorRef.current(event.error);
                setIsListening(false);
            }
        };

        recognition.onend = () => {
            if (!isMountedRef.current) return;

            // Only restart if we didn't have an error (errors are handled in onerror)
            // and we are still supposed to be listening
            if (isListeningRef.current && !didErrorRef.current) {
                console.log("Restarting recognition (manual continuous)...");
                // Small delay to be gentle
                setTimeout(() => {
                    if (isMountedRef.current && isListeningRef.current && !didErrorRef.current) {
                        try {
                            recognition.start();
                        } catch (e) {
                            console.error("Failed to restart recognition:", e);
                        }
                    }
                }, 100);
            } else if (!didErrorRef.current) {
                // Clean stop
                setIsListening(false);
            }
            // If didErrorRef is true, we let onerror handle the state (retry or stop)
        };

        return recognition;
    }, [language]);

    const startListening = useCallback((options?: { isRetry?: boolean }) => {
        console.log(`useSpeechRecognition: startListening called (isRetry: ${!!options?.isRetry})`);
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);

        // Check for offline state
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            console.error("Browser is offline");
            setError("You are offline. Please check your connection.");
            setIsListening(false);
            return;
        }

        // Reset error tracking ONLY on manual start
        if (!options?.isRetry) {
            retryCountRef.current = 0;
            didErrorRef.current = false;
        }

        // If we already have an active instance, don't create a new one
        if (!recognitionRef.current) {
            console.log("useSpeechRecognition: Creating new recognition instance");
            recognitionRef.current = initializeRecognition();
        }

        if (recognitionRef.current) {
            try {
                // Check if we are already listening according to our state
                // Use ref to avoid dependency loop
                if (isListeningRef.current) {
                    console.log("useSpeechRecognition: Already listening (state check)");
                    return;
                }

                console.log("useSpeechRecognition: Calling recognition.start()");
                recognitionRef.current.start();

                // Only clear error if it's a manual start. 
                // If it's a retry, keep the error (e.g. "network") so UI shows "Retrying..."
                if (!options?.isRetry) {
                    setError(null);
                }
            } catch (e: any) {
                if (e.name === 'InvalidStateError' || e.message?.includes('already started')) {
                    console.log("Recognition already started (InvalidStateError). Syncing state.");
                    setIsListening(true);
                    // If we are retrying, don't clear error
                    if (!options?.isRetry) {
                        setError(null);
                    }
                    return;
                }
                console.error("Error starting recognition:", e);
                setError(e.message || "Failed to start recording");
                // If start fails with other errors, it might be because the instance is bad. Kill it.
                recognitionRef.current = null;
                setIsListening(false);
            }
        }
    }, [initializeRecognition]);

    // Update the ref so initializeRecognition can call it
    useEffect(() => {
        startListeningRef.current = startListening;
    }, [startListening]);

    const stopListening = useCallback(() => {
        if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);

        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
                // Also try to abort to clear state
                try {
                    recognitionRef.current.abort();
                } catch (e) {
                    // Ignore
                }
                setIsListening(false);
            } catch (e) {
                console.error("Error stopping recognition:", e);
            }
        }
    }, []);

    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort(); // Use abort on unmount
                } catch (e) {
                    // Ignore stop errors
                }
            }
        };
    }, []);

    // Re-initialize if language changes
    useEffect(() => {
        if (isListening) {
            stopListening();
            // Small delay to let it stop before restarting with new language
            setTimeout(() => {
                if (isMountedRef.current) startListening();
            }, 100);
        }
        // We don't want to trigger this on every prop change, just language
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        resetTranscript,
        hasSupport: typeof window !== 'undefined' && 'webkitSpeechRecognition' in window
    };
}
