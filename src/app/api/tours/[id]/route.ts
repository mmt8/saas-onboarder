import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const body = await request.json();
        const { title, steps } = body;

        // Update tour title if provided
        if (title) {
            const { error: tourError } = await supabase
                .from('tours')
                .update({ title })
                .eq('id', id);

            if (tourError) throw tourError;
        }

        // Update steps if provided
        if (steps && Array.isArray(steps)) {
            // First delete existing steps for this tour
            // A more efficient way would be diffing, but full replacement is safer for generic updates from widget
            const { error: deleteError } = await supabase
                .from('steps')
                .delete()
                .eq('tour_id', id);

            if (deleteError) throw deleteError;

            // Insert new steps
            if (steps.length > 0) {
                const formattedSteps = steps.map((s: any, index: number) => ({
                    tour_id: id,
                    target: s.target,
                    content: s.content,
                    order: index, // Ensure order is based on array index
                    action: s.action || 'click'
                }));

                const { error: insertError } = await supabase
                    .from('steps')
                    .insert(formattedSteps);

                if (insertError) throw insertError;
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Update Tour Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const { error } = await supabase
            .from('tours')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Delete Tour Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
