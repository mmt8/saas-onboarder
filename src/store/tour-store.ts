import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Step = {
    id: string;
    target: string; // CSS selector
    content: string;
    order: number;
    action?: 'click' | 'hover' | 'type';
    actionValue?: string;
};

export type Tour = {
    id: string;
    title: string;
    description?: string;
    steps: Step[];
    pageUrl: string;
    createdAt: Date;
    updatedAt: Date;
};

export type TourStatus = 'idle' | 'recording' | 'playing' | 'editing';

interface TourState {
    tours: Tour[];
    currentTour: Tour | null;
    status: TourStatus;
    isRecording: boolean;
    creationMode: 'manual' | 'auto' | 'voice' | null;
    recordedSteps: Step[];
    editingTourId: string | null;
    voiceTranscript: string;
    interimVoiceTranscript: string;
    language: string;

    // Actions
    setLanguage: (lang: string) => void;
    setInterimVoiceTranscript: (transcript: string) => void;
    addVoiceTranscript: (transcript: string) => void;
    clearVoiceTranscript: () => void;
    startRecording: (mode: 'manual' | 'auto' | 'voice') => void;
    stopRecording: () => void;
    editTour: (tour: Tour) => void;
    addStep: (step: Omit<Step, 'id' | 'order'>) => void;
    setSteps: (steps: Step[]) => void;
    updateStep: (id: string, updates: Partial<Step>) => void;
    deleteStep: (id: string) => void;
    reorderSteps: (steps: Step[]) => void;
    saveTour: (title: string, pageUrl?: string) => void;
    setTour: (tour: Tour) => void;
    setStatus: (status: TourStatus) => void;
}

export const useTourStore = create<TourState>()(
    persist(
        (set, get) => ({
            tours: [],
            currentTour: null,
            status: 'idle',
            isRecording: false,
            creationMode: null,
            recordedSteps: [],
            editingTourId: null,
            voiceTranscript: '',
            interimVoiceTranscript: '',
            language: 'en-US',

            setLanguage: (lang) => set({ language: lang }),

            setInterimVoiceTranscript: (transcript) => set({ interimVoiceTranscript: transcript }),

            addVoiceTranscript: (transcript) => set((state) => {
                const { recordedSteps, isRecording, creationMode } = state;
                console.log("Store: addVoiceTranscript called", { transcript, isRecording, creationMode, steps: recordedSteps.length });

                // If we have recorded steps and we are in voice mode, update the last step
                if (isRecording && creationMode === 'voice' && recordedSteps.length > 0) {
                    const lastStep = recordedSteps[recordedSteps.length - 1];
                    console.log("Store: Updating last step", lastStep.id);

                    let newContent = lastStep.content;
                    // If content is empty (placeholder state), replace it
                    if (!newContent) {
                        newContent = transcript;
                    } else {
                        newContent = (newContent + " " + transcript).trim();
                    }

                    const newSteps = [...recordedSteps];
                    newSteps[newSteps.length - 1] = {
                        ...lastStep,
                        content: newContent
                    };

                    return { recordedSteps: newSteps, voiceTranscript: '' };
                }

                console.log("Store: Buffering transcript");
                // Otherwise buffer it for the next step
                return {
                    voiceTranscript: (state.voiceTranscript + " " + transcript).trim()
                };
            }),

            clearVoiceTranscript: () => set({ voiceTranscript: '', interimVoiceTranscript: '' }),

            startRecording: (mode) => set({ status: 'recording', isRecording: true, creationMode: mode, recordedSteps: [], editingTourId: null, voiceTranscript: '', interimVoiceTranscript: '' }),

            stopRecording: () => set({ status: 'idle', isRecording: false, creationMode: null, editingTourId: null, voiceTranscript: '', interimVoiceTranscript: '' }),

            editTour: (tour) => set({
                status: 'recording', // Re-use recording state to show editor
                isRecording: true,
                creationMode: 'manual',
                recordedSteps: [...tour.steps],
                editingTourId: tour.id
            }),

            addStep: (stepData) => {
                const { recordedSteps } = get();
                const newStep: Step = {
                    id: crypto.randomUUID(),
                    order: recordedSteps.length,
                    ...stepData,
                };
                set({ recordedSteps: [...recordedSteps, newStep] });
            },

            setSteps: (steps) => set({ recordedSteps: steps }),

            updateStep: (id, updates) => {
                const { recordedSteps } = get();
                set({
                    recordedSteps: recordedSteps.map((step) =>
                        step.id === id ? { ...step, ...updates } : step
                    ),
                });
            },

            deleteStep: (id) => {
                const { recordedSteps } = get();
                set({
                    recordedSteps: recordedSteps
                        .filter((step) => step.id !== id)
                        .map((step, index) => ({ ...step, order: index })), // Re-order
                });
            },

            reorderSteps: (steps) => {
                set({
                    recordedSteps: steps.map((step, index) => ({ ...step, order: index }))
                });
            },

            saveTour: (title, pageUrl = '/') => {
                const { recordedSteps, tours, editingTourId } = get();

                if (editingTourId) {
                    // Update existing tour
                    set({
                        tours: tours.map(t => t.id === editingTourId ? {
                            ...t,
                            title,
                            steps: recordedSteps,
                            pageUrl: pageUrl || t.pageUrl,
                            updatedAt: new Date()
                        } : t),
                        recordedSteps: [],
                        status: 'idle',
                        isRecording: false,
                        editingTourId: null,
                        creationMode: null
                    });
                } else {
                    // Create new tour
                    const newTour: Tour = {
                        id: crypto.randomUUID(),
                        title,
                        steps: recordedSteps,
                        pageUrl,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    set({
                        tours: [...tours, newTour],
                        recordedSteps: [],
                        status: 'idle',
                        isRecording: false,
                        creationMode: null
                    });
                }
            },

            setTour: (tour) => set({ currentTour: tour }),

            setStatus: (status) => set({ status }),
        }),
        {
            name: 'tour-store',
            partialize: (state) => ({ tours: state.tours }),
        }
    )
);
