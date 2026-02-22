import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminClient = createClient(supabaseUrl, supabaseServiceKey);

// PATCH - Duyệt/Từ chối media
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { action } = body; // 'approve' or 'reject'

        if (action !== 'approve' && action !== 'reject') {
            return NextResponse.json(
                { error: 'Invalid action' },
                { status: 400 }
            );
        }

        const newState = action === 'approve' ? 'PUBLISHED' : 'REJECTED';

        const { data, error } = await adminClient
            .from('media')
            .update({ state: newState })
            .eq('id', params.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// DELETE - Xóa media
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Lấy thông tin media trước để xóa file storage
        const { data: media } = await adminClient
            .from('media')
            .select('file_name, uploader_id')
            .eq('id', params.id)
            .single();

        if (media) {
            // Xóa file khỏi storage
            const filePath = `${media.uploader_id}/${media.file_name}`;
            await adminClient.storage.from('media').remove([filePath]);
        }

        // Xóa metadata
        const { error } = await adminClient
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
