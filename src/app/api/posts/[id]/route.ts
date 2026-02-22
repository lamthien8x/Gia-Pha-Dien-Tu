import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminClient = createClient(supabaseUrl, supabaseServiceKey);

// PATCH - Cập nhật post (ghim/bỏ ghim)
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { is_pinned } = body;

        const { data, error } = await adminClient
            .from('posts')
            .update({ is_pinned })
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

// DELETE - Xóa post
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { error } = await adminClient
            .from('posts')
            .delete()
            .eq('id', params.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
