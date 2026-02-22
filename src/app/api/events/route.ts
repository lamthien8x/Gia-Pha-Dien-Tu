import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const getAdminClient = () => createClient(supabaseUrl, supabaseServiceKey);

// GET - Lấy danh sách events
export async function GET(request: NextRequest) {
    try {
        const { data, error } = await getAdminClient()
            .from('events')
            .select('*')
            .order('start_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
            const userIds = [...new Set(data.map(item => item.creator_id).filter(Boolean))];
            if (userIds.length > 0) {
                const { data: profiles } = await getAdminClient().from('profiles').select('id, display_name, email').in('id', userIds);
                const profileMap: Record<string, any> = {};
                if (profiles) {
                    profiles.forEach(p => profileMap[p.id] = { display_name: p.display_name, email: p.email });
                }
                data.forEach(item => {
                    if (item.creator_id && profileMap[item.creator_id]) {
                        item.creator = profileMap[item.creator_id];
                    }
                });
            }
        }

        // Get RSVP counts
        if (data && data.length > 0) {
            const eventIds = data.map(e => e.id);
            const { data: rsvps } = await getAdminClient()
                .from('event_rsvps')
                .select('event_id, status')
                .in('event_id', eventIds);

            const rsvpMap: Record<string, number> = {};
            rsvps?.forEach((r: { event_id: string; status: string }) => {
                if (r.status === 'going') {
                    rsvpMap[r.event_id] = (rsvpMap[r.event_id] || 0) + 1;
                }
            });

            data.forEach((e: any) => {
                e.rsvp_count = rsvpMap[e.id] || 0;
            });
        }

        return NextResponse.json({ data });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// POST - Tạo event mới
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, description, start_at, location, type, creator_id } = body;

        // Validation
        if (!title || !start_at || !creator_id) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate date
        const startDate = new Date(start_at);
        if (isNaN(startDate.getTime())) {
            return NextResponse.json(
                { error: 'Invalid start_at date' },
                { status: 400 }
            );
        }

        const { data, error } = await getAdminClient()
            .from('events')
            .insert({
                title: title.trim(),
                description: description?.trim() || null,
                start_at: startDate.toISOString(),
                location: location?.trim() || null,
                type: type || 'OTHER',
                creator_id,
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
