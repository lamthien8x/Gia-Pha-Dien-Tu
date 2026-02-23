import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const getAdminClient = () => createClient(supabaseUrl, supabaseServiceKey);

// GET - Lấy danh sách posts
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'published';
        const limitStr = searchParams.get('limit');
        const offsetStr = searchParams.get('offset');

        const limit = limitStr ? parseInt(limitStr, 10) : 20; // Default 20
        const offset = offsetStr ? parseInt(offsetStr, 10) : 0;

        let query = getAdminClient()
            .from('posts')
            .select('*', { count: 'exact' })
            .eq('status', status)
            .order('is_pinned', { ascending: false })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        const { data, error, count } = await query;

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

        // Get comment counts
        if (data && data.length > 0) {
            const postIds = data.map(p => p.id);
            const { data: counts } = await getAdminClient()
                .from('post_comments')
                .select('post_id')
                .in('post_id', postIds);

            const countMap: Record<string, number> = {};
            counts?.forEach((c: { post_id: string }) => {
                countMap[c.post_id] = (countMap[c.post_id] || 0) + 1;
            });

            data.forEach((p: any) => {
                p.comment_count = countMap[p.id] || 0;
            });
        }

        return NextResponse.json({ data, meta: { count, limit, offset } });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// POST - Tạo post mới
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { author_id, type, title, body: content, is_pinned } = body;

        // Validation
        if (!author_id || !content) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (content.length > 5000) {
            return NextResponse.json(
                { error: 'Content too long (max 5000 characters)' },
                { status: 400 }
            );
        }

        const { data, error } = await getAdminClient()
            .from('posts')
            .insert({
                author_id,
                type: type || 'general',
                title: title || null,
                body: content,
                is_pinned: is_pinned || false,
                status: 'published',
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
