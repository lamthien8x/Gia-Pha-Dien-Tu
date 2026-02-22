import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const getAdminClient = () => createClient(supabaseUrl, supabaseServiceKey);

// GET - Lấy comments của post
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const params = await context.params;
        const { data, error } = await getAdminClient()
            .from('post_comments')
            .select('*')
            .eq('post_id', params.id)
            .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
            const userIds = [...new Set(data.map(item => item.author_id).filter(Boolean))];
            if (userIds.length > 0) {
                const { data: profiles } = await getAdminClient().from('profiles').select('id, display_name, email').in('id', userIds);
                const profileMap: Record<string, any> = {};
                if (profiles) {
                    profiles.forEach(p => profileMap[p.id] = { display_name: p.display_name, email: p.email });
                }
                data.forEach(item => {
                    if (item.author_id && profileMap[item.author_id]) {
                        item.author = profileMap[item.author_id];
                    }
                });
            }
        }

        return NextResponse.json({ data });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// POST - Thêm comment mới
export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        const params = await context.params;
        const body = await request.json();
        const { author_id, body: content } = body;

        if (!author_id || !content) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (content.length > 1000) {
            return NextResponse.json(
                { error: 'Comment too long (max 1000 characters)' },
                { status: 400 }
            );
        }

        const { data, error } = await getAdminClient()
            .from('post_comments')
            .insert({
                post_id: params.id,
                author_id,
                body: content,
            })
            .select('*')
            .single();

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
