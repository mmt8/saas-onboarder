import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';

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
    project_id?: string;
    title: string;
    description?: string;
    steps: Step[];
    pageUrl: string;
    createdAt: Date;
    updatedAt: Date;
};

export type Project = {
    id: string;
    name: string;
    domain?: string;
    showLauncher: boolean;
    launcherText: string;
    createdAt: Date;
};

export type TourStatus = 'idle' | 'recording' | 'playing' | 'editing';

interface TourState {
    tours: Tour[];
    projects: Project[];
    currentProjectId: string | null;
    currentTour: Tour | null;
    status: TourStatus;
    isRecording: boolean;
    isLoading: boolean;
    creationMode: 'manual' | 'auto' | 'voice' | null;
    recordedSteps: Step[];
    editingTourId: string | null;
    voiceTranscript: string;
    interimVoiceTranscript: string;
    language: string;

    // Auth State
    user: any | null;
    isAuthLoading: boolean;

    // Actions
    fetchProjects: () => Promise<void>;
    setCurrentProject: (id: string) => void;
    createProject: (name: string, domain?: string) => Promise<{ data: any, error: any }>;
    updateProjectSettings: (id: string, updates: { showLauncher?: boolean, launcherText?: string }) => Promise<void>;
    fetchTours: () => Promise<void>;
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
    deleteTour: (id: string) => Promise<void>;
    reorderSteps: (steps: Step[]) => void;
    saveTour: (title: string, pageUrl?: string) => Promise<void>;
    setTour: (tour: Tour) => void;
    setStatus: (status: TourStatus) => void;

    // Auth Actions
    signUp: (email: string, password: string) => Promise<{ error: any }>;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signInWithGoogle: () => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    checkAuth: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: any }>;
    updatePassword: (password: string) => Promise<{ error: any }>;
}

export const useTourStore = create<TourState>()(
    persist(
        (set, get) => ({
            tours: [],
            projects: [],
            currentProjectId: null,
            currentTour: null,
            status: 'idle',
            isRecording: false,
            isLoading: false,
            creationMode: null,
            recordedSteps: [],
            editingTourId: null,
            voiceTranscript: '',
            interimVoiceTranscript: '',
            language: 'en-US',
            user: null,
            isAuthLoading: true,

            fetchProjects: async () => {
                set({ isLoading: true });
                try {
                    const { data, error } = await supabase
                        .from('projects')
                        .select('*')
                        .order('created_at', { ascending: false });

                    if (error) throw error;

                    const formattedProjects: Project[] = data.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        domain: p.domain,
                        showLauncher: p.show_launcher ?? true,
                        launcherText: p.launcher_text ?? 'Product Tours',
                        createdAt: new Date(p.created_at)
                    }));

                    set({ projects: formattedProjects });

                    // Auto-select first project if none selected
                    if (formattedProjects.length > 0 && !get().currentProjectId) {
                        set({ currentProjectId: formattedProjects[0].id });
                    }
                } catch (error) {
                    console.error('Error fetching projects:', error);
                } finally {
                    set({ isLoading: false });
                }
            },

            setCurrentProject: (id) => set({ currentProjectId: id }),

            createProject: async (name: string, domain?: string) => {
                set({ isLoading: true });
                try {
                    const { data, error } = await supabase
                        .from('projects')
                        .insert({ name, domain })
                        .select()
                        .single();

                    if (error) throw error;

                    await get().fetchProjects();
                    if (data) set({ currentProjectId: data.id });

                    return { data, error: null };
                } catch (error: any) {
                    console.error('Error creating project:', error);
                    return { data: null, error };
                } finally {
                    set({ isLoading: false });
                }
            },

            updateProjectSettings: async (id, updates) => {
                set({ isLoading: true });
                try {
                    const { error } = await supabase
                        .from('projects')
                        .update({
                            show_launcher: updates.showLauncher,
                            launcher_text: updates.launcherText
                        })
                        .eq('id', id);

                    if (error) throw error;

                    // Refresh projects list
                    await get().fetchProjects();
                } catch (error) {
                    console.error('Error updating project settings:', error);
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchTours: async () => {
                const { currentProjectId } = get();
                if (!currentProjectId) {
                    // If no project selected, try to fetch projects first
                    await get().fetchProjects();
                }

                const updatedProjectId = get().currentProjectId;
                if (!updatedProjectId) return;

                set({ isLoading: true });
                try {
                    const { data: toursData, error: toursError } = await supabase
                        .from('tours')
                        .select('*, steps(*)')
                        .eq('project_id', updatedProjectId);

                    if (toursError) throw toursError;

                    const formattedTours: Tour[] = toursData.map((t: any) => ({
                        id: t.id,
                        project_id: t.project_id,
                        title: t.title,
                        description: t.description,
                        pageUrl: t.page_url,
                        createdAt: new Date(t.created_at),
                        updatedAt: new Date(t.updated_at),
                        steps: (t.steps || [])
                            .sort((a: any, b: any) => a.order - b.order)
                            .map((s: any) => ({
                                id: s.id,
                                target: s.target,
                                content: s.content,
                                order: s.order,
                                action: s.action,
                                actionValue: s.action_value
                            }))
                    }));

                    set({ tours: formattedTours });
                } catch (error) {
                    console.error('Error fetching tours:', error);
                } finally {
                    set({ isLoading: false });
                }
            },

            setLanguage: (lang) => set({ language: lang }),

            setInterimVoiceTranscript: (transcript) => set({ interimVoiceTranscript: transcript }),

            addVoiceTranscript: (transcript) => set((state) => {
                const { recordedSteps, isRecording, creationMode } = state;

                if (isRecording && creationMode === 'voice' && recordedSteps.length > 0) {
                    const lastStep = recordedSteps[recordedSteps.length - 1];
                    let newContent = lastStep.content;
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

                return {
                    voiceTranscript: (state.voiceTranscript + " " + transcript).trim()
                };
            }),

            clearVoiceTranscript: () => set({ voiceTranscript: '', interimVoiceTranscript: '' }),

            startRecording: (mode) => set({ status: 'recording', isRecording: true, creationMode: mode, recordedSteps: [], editingTourId: null, voiceTranscript: '', interimVoiceTranscript: '' }),

            stopRecording: () => set({ status: 'idle', isRecording: false, creationMode: null, editingTourId: null, voiceTranscript: '', interimVoiceTranscript: '' }),

            editTour: (tour) => set({
                status: 'recording',
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
                        .map((step, index) => ({ ...step, order: index })),
                });
            },

            deleteTour: async (id) => {
                const { tours } = get();
                try {
                    const { error } = await supabase
                        .from('tours')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;
                    set({ tours: tours.filter((tour) => tour.id !== id) });
                } catch (error) {
                    console.error('Error deleting tour:', error);
                }
            },

            reorderSteps: (steps) => {
                set({
                    recordedSteps: steps.map((step, index) => ({ ...step, order: index }))
                });
            },

            saveTour: async (title, pageUrl = '/') => {
                const { recordedSteps, tours, editingTourId, currentProjectId } = get();

                if (!currentProjectId) {
                    console.error("Cannot save tour: No project selected");
                    return;
                }

                set({ isLoading: true });

                try {
                    let tourId = editingTourId;

                    if (editingTourId) {
                        // Update existing tour
                        const { error: tourError } = await supabase
                            .from('tours')
                            .update({
                                title,
                                page_url: pageUrl,
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', editingTourId);

                        if (tourError) throw tourError;

                        // Delete existing steps and re-insert (simplest for reordering)
                        const { error: deleteStepsError } = await supabase
                            .from('steps')
                            .delete()
                            .eq('tour_id', editingTourId);

                        if (deleteStepsError) throw deleteStepsError;
                    } else {
                        // Create new tour
                        const { data: newTourData, error: tourError } = await supabase
                            .from('tours')
                            .insert({
                                project_id: currentProjectId,
                                title,
                                page_url: pageUrl
                            })
                            .select()
                            .single();

                        if (tourError) throw tourError;
                        tourId = newTourData.id;
                    }

                    // Insert steps
                    const stepsToInsert = recordedSteps.map((s, idx) => ({
                        tour_id: tourId,
                        target: s.target,
                        content: s.content,
                        order: idx,
                        action: s.action,
                        action_value: s.actionValue
                    }));

                    const { error: stepsError } = await supabase
                        .from('steps')
                        .insert(stepsToInsert);

                    if (stepsError) throw stepsError;

                    // Refresh local state from DB
                    const { fetchTours } = get();
                    await fetchTours();

                    set({
                        recordedSteps: [],
                        status: 'idle',
                        isRecording: false,
                        editingTourId: null,
                        creationMode: null
                    });
                } catch (error) {
                    console.error('Error saving tour:', error);
                } finally {
                    set({ isLoading: false });
                }
            },

            setTour: (tour) => set({ currentTour: tour }),

            setStatus: (status) => set({ status }),

            signUp: async (email, password) => {
                const { data, error } = await supabase.auth.signUp({ email, password });
                if (!error) set({ user: data.user });
                return { error };
            },

            signIn: async (email, password) => {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (!error) set({ user: data.user });
                return { error };
            },

            signInWithGoogle: async () => {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: `${window.location.origin}/dashboard`,
                    },
                });
                return { error };
            },

            signOut: async () => {
                await supabase.auth.signOut();
                set({ user: null, projects: [], tours: [], currentProjectId: null });
            },

            checkAuth: async () => {
                const { data: { user } } = await supabase.auth.getUser();
                set({ user, isAuthLoading: false });
            },

            resetPassword: async (email: string) => {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                });
                return { error };
            },

            updatePassword: async (password: string) => {
                const { error } = await supabase.auth.updateUser({ password });
                return { error };
            },
        }),
        {
            name: 'tour-store',
            partialize: (state) => ({
                tours: state.tours,
                currentProjectId: state.currentProjectId,
                isRecording: state.isRecording,
                recordedSteps: state.recordedSteps,
                creationMode: state.creationMode,
                editingTourId: state.editingTourId,
            }),
        }
    )
);
