import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export type Step = {
    id: string;
    target: string; // CSS selector
    content: string;
    order: number;
    name?: string; // User-friendly label for the step
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
    isActive: boolean;
    playBehavior: 'first_time' | 'weekly' | 'monthly_thrice';
    createdAt: Date;
    updatedAt: Date;
};

export type Project = {
    id: string;
    name: string;
    domain?: string;
    showLauncher: boolean;
    launcherText: string;
    themeSettings: {
        fontFamily: string;
        darkMode: boolean;
        primaryColor: string;
        borderRadius: string;
        paddingV: string;
        paddingH: string;
        tooltipStyle: 'solid' | 'color' | 'glass' | 'auto';
        tooltipColor: string;
    };
    lastSeenAt?: Date;
    createdAt: Date;
};

export type TourStatus = 'idle' | 'recording' | 'playing' | 'editing';

export type Profile = {
    id: string;
    email: string;
    fullName?: string;
    companyName?: string;
    country?: string;
    createdAt: Date;
    updatedAt: Date;
};

interface TourState {
    tours: Tour[];
    projects: Project[];
    currentProjectId: string | null;
    currentTour: Tour | null;
    status: TourStatus;
    isRecording: boolean;
    isLoading: boolean;
    creationMode: 'manual' | 'auto' | null;
    recordedSteps: Step[];
    editingTourId: string | null;
    recordingTourTitle: string;
    language: string;

    // Auth State
    user: any | null;
    isAuthLoading: boolean;
    profile: Profile | null;

    // Actions
    fetchProjects: () => Promise<Project[]>;
    setCurrentProject: (id: string) => void;
    createProject: (name: string, domain?: string) => Promise<{ data: any, error: any }>;
    updateProjectSettings: (id: string, updates: {
        name?: string,
        domain?: string,
        showLauncher?: boolean,
        launcherText?: string,
        themeSettings?: Project['themeSettings']
    }) => Promise<void>;
    saveDetectedBranding: (projectId: string, branding: { primaryColor: string; fontFamily: string; borderRadius: string; textColor: 'white' | 'black' }) => Promise<void>;
    pingProject: (id: string | null) => Promise<void>;
    fetchTours: () => Promise<void>;
    // Widget-specific fetch using RPC (bypasses RLS for anonymous widget access)
    fetchProjectById: (projectId: string) => Promise<void>;
    fetchToursForWidget: (projectId: string) => Promise<void>;
    startRecording: (mode: 'manual' | 'auto', title?: string) => void;
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
    toggleTourActivation: (tourId: string) => Promise<void>;
    updateTourBehavior: (tourId: string, behavior: Tour['playBehavior']) => Promise<void>;

    // Auth Actions
    signUp: (email: string, password: string) => Promise<{ data?: any; error: any }>;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signInWithGoogle: () => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    checkAuth: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: any }>;
    updatePassword: (password: string) => Promise<{ error: any }>;
    deleteProject: (id: string) => Promise<void>;

    // Profile Actions
    fetchProfile: () => Promise<void>;
    updateProfile: (updates: { fullName?: string; companyName?: string; country?: string }) => Promise<{ error: any } | void>;
}

// Helper for consistent URL matching
const normalizeUrl = (url?: string) => {
    if (!url) return '/';
    let clean = url.trim();
    if (!clean.startsWith('/')) clean = '/' + clean;
    if (clean !== '/' && clean.endsWith('/')) clean = clean.slice(0, -1);
    return clean || '/';
};

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
            recordingTourTitle: '',
            language: 'en-US',
            user: null,
            isAuthLoading: true,
            profile: null,

            setTour: (tour) => set({ currentTour: tour }),
            setStatus: (status) => set({ status }),

            checkAuth: async () => {
                set({ isAuthLoading: true });
                try {
                    const { data: { session } } = await supabase.auth.getSession();
                    set({ user: session?.user ?? null });

                    supabase.auth.onAuthStateChange((_event: string, session: { user: any } | null) => {
                        set({ user: session?.user ?? null });
                    });
                } catch (error) {
                    console.error('Error checking auth:', error);
                } finally {
                    set({ isAuthLoading: false });
                }
            },

            signUp: async (email, password) => {
                const { data, error } = await supabase.auth.signUp({ email, password });
                return { data, error };
            },

            signIn: async (email, password) => {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                // Update last_login timestamp on successful login
                if (!error) {
                    supabase.rpc('update_last_login').catch(() => { });
                }
                return { error };
            },

            signInWithGoogle: async () => {
                const { error } = await supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: {
                        redirectTo: `${window.location.origin}/dashboard`
                    }
                });
                return { error };
            },

            signOut: async () => {
                await supabase.auth.signOut();
                set({ user: null, currentProjectId: null });
            },

            resetPassword: async (email) => {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                });
                return { error };
            },

            updatePassword: async (password) => {
                const { error } = await supabase.auth.updateUser({ password });
                return { error };
            },

            fetchProjects: async () => {
                set({ isLoading: true });
                try {
                    // Use RPC to get only the current user's projects (reliable ownership filtering)
                    const { data, error } = await supabase.rpc('get_my_projects');

                    if (error) {
                        // Fallback to direct query if RPC doesn't exist yet
                        console.warn('get_my_projects RPC not found, falling back to direct query');
                        const fallback = await supabase
                            .from('projects')
                            .select('*')
                            .order('created_at', { ascending: false });
                        if (fallback.error) throw fallback.error;
                        const formattedProjects: Project[] = (fallback.data || []).map((p: any) => ({
                            id: p.id,
                            name: p.name,
                            domain: p.domain,
                            showLauncher: p.show_launcher ?? true,
                            launcherText: p.launcher_text ?? 'Product Tours',
                            themeSettings: {
                                fontFamily: p.theme_settings?.fontFamily ?? 'Inter',
                                darkMode: p.theme_settings?.darkMode ?? false,
                                primaryColor: p.theme_settings?.primaryColor ?? '#E65221',
                                borderRadius: p.theme_settings?.borderRadius ?? '12',
                                paddingV: p.theme_settings?.paddingV ?? '10',
                                paddingH: p.theme_settings?.paddingH ?? '20',
                                tooltipStyle: p.theme_settings?.tooltipStyle ?? 'solid',
                                tooltipColor: p.theme_settings?.tooltipColor ?? '#E65221'
                            },
                            lastSeenAt: p.last_seen_at ? new Date(p.last_seen_at) : undefined,
                            createdAt: new Date(p.created_at)
                        }));
                        set({ projects: formattedProjects });
                        if (formattedProjects.length > 0 && !get().currentProjectId) {
                            set({ currentProjectId: formattedProjects[0].id });
                        }
                        return formattedProjects;
                    }

                    const formattedProjects: Project[] = (data || []).map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        domain: p.domain,
                        showLauncher: p.show_launcher ?? true,
                        launcherText: p.launcher_text ?? 'Product Tours',
                        themeSettings: {
                            fontFamily: p.theme_settings?.fontFamily ?? 'Inter',
                            darkMode: p.theme_settings?.darkMode ?? false,
                            primaryColor: p.theme_settings?.primaryColor ?? '#E65221',
                            borderRadius: p.theme_settings?.borderRadius ?? '12',
                            paddingV: p.theme_settings?.paddingV ?? '10',
                            paddingH: p.theme_settings?.paddingH ?? '20',
                            tooltipStyle: p.theme_settings?.tooltipStyle ?? 'solid',
                            tooltipColor: p.theme_settings?.tooltipColor ?? '#E65221'
                        },
                        lastSeenAt: p.last_seen_at ? new Date(p.last_seen_at) : undefined,
                        createdAt: new Date(p.created_at)
                    }));

                    set({ projects: formattedProjects });

                    // Auto-select first project if none selected
                    if (formattedProjects.length > 0 && !get().currentProjectId) {
                        set({ currentProjectId: formattedProjects[0].id });
                    }
                    return formattedProjects;
                } catch (error) {
                    console.error('Error fetching projects:', error);
                    return get().projects;
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
                            name: updates.name,
                            domain: updates.domain,
                            show_launcher: updates.showLauncher,
                            launcher_text: updates.launcherText,
                            theme_settings: updates.themeSettings
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

            saveDetectedBranding: async (projectId: string, branding: { primaryColor: string; fontFamily: string; borderRadius: string; textColor: 'white' | 'black' }) => {
                if (!projectId || !branding) {
                    console.warn('Product Tour: saveDetectedBranding called with missing data', { projectId, branding });
                    return;
                }
                console.log('Product Tour: Attempting to save branding to database...', { projectId, branding });
                try {
                    // Use RPC to bypass RLS restrictions for anonymous widget updates
                    const { error, data } = await supabase.rpc('save_detected_branding', {
                        project_id: projectId,
                        primary_color: branding.primaryColor,
                        font_family: branding.fontFamily,
                        border_radius: branding.borderRadius,
                        text_color: branding.textColor
                    });

                    console.log('Product Tour: RPC response', { error, data });

                    if (error) {
                        if (error.code === 'PGRST202') {
                            console.warn('Product Tour: Database function "save_detected_branding" not found. Please run the SQL migration from supabase_rpc_branding.sql');
                        } else {
                            console.error('Product Tour: Error saving detected branding:', error);
                        }
                        return;
                    }

                    console.log('Product Tour: Detected branding saved successfully for project', projectId);
                    // Note: NOT refreshing projects here to avoid re-render cascade
                } catch (error) {
                    console.error('Product Tour: Exception saving detected branding:', error);
                }
            },

            pingProject: async (id) => {
                if (!id) return;
                try {
                    // Use RPC to bypass RLS restrictions for anonymous pings
                    const { error } = await supabase.rpc('ping_project', {
                        project_id: id
                    });

                    if (error) {
                        if (error.code === 'PGRST202') {
                            console.warn('Product Tour: Database function "ping_project" not found. Please run the provided SQL migration.');
                        } else {
                            console.error('Ping error details:', error);
                        }
                    }
                } catch (error) {
                    console.error('Ping exception:', error);
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
                        isActive: t.is_active || false,
                        playBehavior: t.play_behavior || 'first_time',
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

            // Widget-specific fetch using RPC (bypasses RLS for anonymous widget access)
            fetchProjectById: async (projectId: string) => {
                try {
                    const { data, error } = await supabase.rpc('get_project_settings', {
                        p_project_id: projectId
                    });

                    if (error) {
                        console.error('Error fetching project via RPC:', error);
                        return;
                    }

                    if (data && data.length > 0) {
                        const p = data[0];
                        const formattedProject: Project = {
                            id: p.id,
                            name: p.name,
                            domain: p.domain,
                            showLauncher: p.show_launcher ?? true,
                            launcherText: p.launcher_text ?? 'Product Tours',
                            themeSettings: {
                                fontFamily: p.theme_settings?.fontFamily ?? 'Inter',
                                darkMode: p.theme_settings?.darkMode ?? false,
                                primaryColor: p.theme_settings?.primaryColor ?? '#E65221',
                                borderRadius: p.theme_settings?.borderRadius ?? '12',
                                paddingV: p.theme_settings?.paddingV ?? '10',
                                paddingH: p.theme_settings?.paddingH ?? '20',
                                tooltipStyle: p.theme_settings?.tooltipStyle ?? 'solid',
                                tooltipColor: p.theme_settings?.tooltipColor ?? '#E65221'
                            },
                            createdAt: new Date()
                        };

                        // Add to projects array if not already present
                        const { projects } = get();
                        if (!projects.find(proj => proj.id === projectId)) {
                            set({ projects: [...projects, formattedProject] });
                        }
                        set({ currentProjectId: projectId });
                    }
                } catch (error) {
                    console.error('Error fetching project by ID:', error);
                }
            },

            fetchToursForWidget: async (projectId: string) => {
                try {
                    // First fetch tours via RPC
                    const { data: toursData, error: toursError } = await supabase.rpc('get_tours_for_project', {
                        p_project_id: projectId
                    });

                    if (toursError) {
                        console.error('Error fetching tours via RPC:', toursError);
                        return;
                    }

                    if (!toursData || toursData.length === 0) {
                        set({ tours: [] });
                        return;
                    }

                    // Fetch steps for each tour
                    const toursWithSteps = await Promise.all(
                        toursData.map(async (t: any) => {
                            const { data: stepsData } = await supabase.rpc('get_steps_for_tour', {
                                p_tour_id: t.id
                            });

                            return {
                                id: t.id,
                                project_id: projectId,
                                title: t.title,
                                description: t.description,
                                pageUrl: t.page_url,
                                isActive: t.is_active || false,
                                playBehavior: t.play_behavior || 'first_time',
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                steps: (stepsData || []).map((s: any) => ({
                                    id: s.id,
                                    target: s.target,
                                    content: s.content,
                                    order: s.order,
                                    action: s.action,
                                    actionValue: s.action_value
                                }))
                            };
                        })
                    );

                    set({ tours: toursWithSteps });
                } catch (error) {
                    console.error('Error fetching tours for widget:', error);
                }
            },

            startRecording: (mode, title = '') => set({
                status: 'recording',
                isRecording: true,
                creationMode: mode,
                recordedSteps: [],
                editingTourId: null,
                recordingTourTitle: title
            }),

            stopRecording: () => set({
                status: 'idle',
                isRecording: false,
                creationMode: null,
                editingTourId: null,
                recordingTourTitle: ''
            }),

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

                if (!title || title.trim().length < 3) {
                    toast.error("Please give your tour a name (min 3 chars)");
                    return;
                }

                // Strictly normalize URL
                const normalizedPageUrl = normalizeUrl(pageUrl);

                set({ isLoading: true });

                try {
                    let tourId = editingTourId;

                    // If creating/updating active, ensure we deactivate others on this new path
                    const existingTour = editingTourId ? tours.find(t => t.id === editingTourId) : null;
                    const willBeActive = existingTour ? existingTour.isActive : true; // Default true for new

                    if (willBeActive) {
                        try {
                            const { error: deactivateError } = await supabase
                                .from('tours')
                                .update({ is_active: false })
                                .eq('project_id', currentProjectId)
                                .eq('page_url', normalizedPageUrl)
                                .neq('id', editingTourId || 'new'); // 'new' is dummy, works safely

                            if (deactivateError) console.warn('Auto-deactivation failed', deactivateError);
                        } catch (e) {
                            console.warn('Auto-deactivation exception', e);
                        }
                    }

                    if (editingTourId) {
                        // Update existing tour
                        const { error: tourError } = await supabase
                            .from('tours')
                            .update({
                                title,
                                page_url: normalizedPageUrl,
                                // is_active preserves current state, logic above handled deactivation of others if this is active
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', editingTourId);

                        if (tourError) throw tourError;

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
                                page_url: normalizedPageUrl,
                                is_active: true,
                                play_behavior: 'first_time'
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
                    toast.error('Failed to save tour');
                } finally {
                    set({ isLoading: false });
                }
            },

            // ... (other methods) ...

            toggleTourActivation: async (tourId: string) => {
                const { tours } = get();
                const tour = tours.find(t => t.id === tourId);
                if (!tour) return;

                const newState = !tour.isActive;
                const normalizedPath = normalizeUrl(tour.pageUrl);

                // Optimistic update
                const updatedTours = tours.map(t => {
                    if (t.id === tourId) return { ...t, isActive: newState };
                    // If we are activating this one, deactivate others on the same normalized page path
                    if (newState) {
                        const tPath = normalizeUrl(t.pageUrl);
                        if (tPath === normalizedPath) return { ...t, isActive: false };
                    }
                    return t;
                });
                set({ tours: updatedTours });

                try {
                    console.log('Store: Toggling tour', tourId, 'to', newState, 'path:', normalizedPath);
                    if (newState) {
                        // If activating, deactivate others on the same page
                        // Using normalized URL comparison in DB might be tricky if data is dirty, 
                        // so we try fairly robust logic or assume DB data is growing cleaner.
                        // Ideally, we'd update all where normalize(page_url) matches, but SQL doesn't have that function easily visible here.
                        // We rely on 'saveTour' enforcing clean URLs now. For legacy, we might miss some non-normalized ones.
                        let query = supabase
                            .from('tours')
                            .update({ is_active: false })
                            .eq('project_id', tour.project_id);

                        if (normalizedPath === '/') {
                            query = query.or('page_url.eq."/",page_url.is.null,page_url.eq.""');
                        } else {
                            // Try to catch exact match or variations if imperative, but mostly exact match after save fix
                            query = query.eq('page_url', normalizedPath);
                        }

                        const { error: deactivateError } = await query.neq('id', tourId);
                        if (deactivateError) throw deactivateError;
                    }

                    const { error: updateError } = await supabase
                        .from('tours')
                        .update({ is_active: newState })
                        .eq('id', tourId);

                    if (updateError) throw updateError;
                } catch (error) {
                    console.error('Error toggling tour activation:', error);
                    set({ tours }); // Rollback
                    toast.error("Failed to toggle tour status");
                }
            },

            updateTourBehavior: async (tourId, behavior) => {
                const { tours } = get();
                const tour = tours.find(t => t.id === tourId);
                if (!tour) return;

                // Optimistic update
                set({
                    tours: tours.map(t =>
                        t.id === tourId ? { ...t, playBehavior: behavior } : t
                    )
                });

                try {
                    const { error } = await supabase
                        .from('tours')
                        .update({ play_behavior: behavior })
                        .eq('id', tourId);

                    if (error) throw error;
                } catch (error) {
                    console.error('Error updating tour behavior:', error);
                    // Rollback
                    set({ tours });
                    toast.error("Failed to update frequency setting");
                }
            },


            deleteProject: async (id: string) => {
                set({ isLoading: true });
                try {
                    // Use RPC for reliable deletion with ownership validation
                    const { error } = await supabase.rpc('delete_project_safe', {
                        p_project_id: id
                    });

                    if (error) {
                        console.error('Delete RPC error:', error);
                        toast.error(error.message || 'Failed to delete project');
                        return;
                    }

                    set((state) => ({
                        projects: state.projects.filter(p => p.id !== id),
                        currentProjectId: state.currentProjectId === id ? null : state.currentProjectId
                    }));

                    toast.success('Project deleted successfully');
                } catch (error: any) {
                    console.error('Error deleting project:', error);
                    toast.error(error?.message || 'Failed to delete project');
                } finally {
                    set({ isLoading: false });
                }
            },

            fetchProfile: async () => {
                const { user } = get();
                if (!user) return;

                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (error) {
                        console.error('Error fetching profile:', error);
                        return;
                    }

                    if (data) {
                        set({
                            profile: {
                                id: data.id,
                                email: data.email || user.email,
                                fullName: data.full_name,
                                companyName: data.company_name,
                                country: data.country,
                                createdAt: new Date(data.created_at),
                                updatedAt: new Date(data.updated_at)
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error fetching profile:', error);
                }
            },

            updateProfile: async (updates) => {
                const { user, profile } = get();
                if (!user) return { error: 'Not authenticated' };

                try {
                    const { error } = await supabase
                        .from('profiles')
                        .upsert({
                            id: user.id,
                            email: user.email,
                            full_name: updates.fullName,
                            company_name: updates.companyName,
                            country: updates.country,
                            updated_at: new Date().toISOString()
                        });

                    if (error) throw error;

                    // Update local state
                    set({
                        profile: {
                            ...profile!,
                            fullName: updates.fullName ?? profile?.fullName,
                            companyName: updates.companyName ?? profile?.companyName,
                            country: updates.country ?? profile?.country,
                            updatedAt: new Date()
                        }
                    });

                    toast.success('Profile updated successfully');
                } catch (error) {
                    console.error('Error updating profile:', error);
                    toast.error('Failed to update profile');
                    return { error };
                }
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
