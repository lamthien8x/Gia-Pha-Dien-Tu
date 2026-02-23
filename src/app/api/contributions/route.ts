import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { notifyNewContribution } from '@/lib/telegram';

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

        // Gửi thông báo Telegram kèm nút Duyệt/Từ chối (fire-and-forget)
        if (rows.length > 0) {
            const first = rows[0];
            const batchTs = String(Date.now()); // timestamp to identify this batch

            notifyNewContribution({
                person_handle: first.person_handle,
                person_name: first.person_name,
                fields: rows.map((r: Record<string, string>) => ({
                    label: r.field_label || r.field_name,
                    old_value: r.old_value,
                    new_value: r.new_value,
                })),
                author_email: first.author_email,
                note: first.note,
                batch_ts: batchTs,
            }).catch(() => { }); // swallow errors
        }

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
