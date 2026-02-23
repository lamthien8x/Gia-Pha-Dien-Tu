import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const getAdminClient = () => createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { rows } = body;

        if (!rows || !Array.isArray(rows)) {
            return NextResponse.json(
                { error: 'Invalid data format' },
                { status: 400 }
            );
        }

        // Insert using admin client to bypass RLS
        // This allows unauthenticated users (guests) to submit contributions
        const { error: insertError } = await getAdminClient()
            .from('contributions')
            .insert(rows);

        if (insertError) {
            return NextResponse.json(
                { error: `Insert failed: ${insertError.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
