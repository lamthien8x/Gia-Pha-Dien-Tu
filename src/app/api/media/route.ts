import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

// Service role client cho admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Admin client - sử dụng service role key
const adminClient = createClient(supabaseUrl, supabaseServiceKey);

// GET - Lấy danh sách media
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const state = searchParams.get('state');

        let query = adminClient
            .from('media')
            .select('*, uploader:profiles(display_name, email)')
            .order('created_at', { ascending: false });

        if (state && state !== 'all') {
            query = query.eq('state', state);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// POST - Upload media metadata
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { file_name, mime_type, file_size, title, uploader_id } = body;

        // Validation
        if (!file_name || !mime_type || !file_size || !uploader_id) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // File size limit: 10MB
        if (file_size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size exceeds 10MB limit' },
                { status: 400 }
            );
        }

        const { data, error } = await adminClient
            .from('media')
            .insert({
                file_name,
                mime_type,
                file_size,
                title: title || file_name,
                state: 'PENDING',
                uploader_id,
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
