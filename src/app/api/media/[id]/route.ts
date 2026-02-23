import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const getAdminClient = () => createClient(supabaseUrl, supabaseServiceKey);

// PATCH - Duyệt/Từ chối hoặc Cập nhật tags media
export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const params = await context.params;
        const body = await request.json();
        const { action, tagged_people, tagged_events } = body;

        if (action === 'approve' || action === 'reject') {
            const newState = action === 'approve' ? 'PUBLISHED' : 'REJECTED';
            const { data, error } = await getAdminClient()
                .from('media')
                .update({ state: newState })
                .eq('id', params.id)
                .select()
                .single();
            if (error) throw error;
            return NextResponse.json({ data });
        }

        if (action === 'update_tags') {
            const updateData: any = {};
            if (tagged_people !== undefined) updateData.tagged_people = tagged_people;
            if (tagged_events !== undefined) updateData.tagged_events = tagged_events;

            const { data, error } = await getAdminClient()
                .from('media')
                .update(updateData)
                .eq('id', params.id)
                .select()
                .single();
            if (error) {
                console.error("Supabase update error:", error);
                throw error;
            }
            return NextResponse.json({ data });
        }

        return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error: any) {
        console.error("API error in PATCH /api/media/[id]:", error);
        return NextResponse.json({ error: error?.message || 'Unknown error', details: error }, { status: 500 });
    }
}

// DELETE - Xóa media
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const params = await context.params;
        // Lấy thông tin media trước để xóa file storage
        const { data: media } = await getAdminClient()
            .from('media')
            .select('file_name, uploader_id')
            .eq('id', params.id)
            .single();

        if (media) {
            // Xóa file khỏi storage
            const filePath = `${media.uploader_id}/${media.file_name}`;
            await getAdminClient().storage.from('media').remove([filePath]);
        }

        // Xóa metadata
        const { error } = await getAdminClient()
            .from('media')
            .delete()
            .eq('id', params.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
