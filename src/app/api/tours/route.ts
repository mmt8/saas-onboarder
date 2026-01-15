import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
        return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
    }

    try {
        // Fetch project settings
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

        if (projectError) throw projectError;

        const { data: toursData, error: toursError } = await supabase
            .from('tours')
            .select('*, steps(*)')
            .eq('project_id', projectId);

        if (toursError) throw toursError;

        // Format data for the widget
        const tours = toursData.map((t: any) => ({
            id: t.id,
            title: t.title,
            description: t.description,
            pageUrl: t.page_url,
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

        return NextResponse.json({
            tours,
            settings: {
                showLauncher: project.show_launcher,
                launcherText: project.launcher_text
            }
        });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('API: Creating tour with body:', JSON.stringify(body, null, 2));

        const { projectId, title, steps, type } = body;

        if (!projectId || !title) {
            console.error('API: Missing required fields');
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Create Tour
        console.log('API: Inserting tour...');
        const { data: tour, error: tourError } = await supabase
            .from('tours')
            .insert({
                project_id: projectId,
                title,
                // type field removed as it does not exist in the schema
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (tourError) {
            console.error('API: Tour insert error:', tourError);
            throw tourError;
        }

        console.log('API: Tour created:', tour.id);

        // 2. Create Steps
        if (steps && steps.length > 0) {
            console.log('API: Inserting steps...');
            const stepsToInsert = steps.map((s: any, idx: number) => ({
                tour_id: tour.id,
                target: s.target,
                content: s.content || '',
                order: idx,
                action: s.action || 'click',
                action_value: s.actionValue
            }));

            const { error: stepsError } = await supabase
                .from('steps')
                .insert(stepsToInsert);

            if (stepsError) {
                console.error('API: Steps insert error:', stepsError);
                throw stepsError;
            }
        }

        console.log('API: Success');
        return NextResponse.json({ success: true, tour });

    } catch (error: any) {
        console.error('Create Tour Error:', error);
        return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
    }
}
