import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { editTelegramMessage, answerCallbackQuery } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const getAdmin = () => createClient(supabaseUrl, supabaseServiceKey);

// Fields that map directly to people table columns (same as edits page)
const PEOPLE_FIELD_MAP: Record<string, string> = {
    avatar_url: 'avatar_url',
    display_name: 'display_name',
    surname: 'surname',
    first_name: 'first_name',
    nick_name: 'nick_name',
    birth_year: 'birth_year',
    birth_date: 'birth_date',
    birth_place: 'birth_place',
    death_year: 'death_year',
    death_date: 'death_date',
    death_place: 'death_place',
    phone: 'phone',
    email: 'email',
    zalo: 'zalo',
    facebook: 'facebook',
    hometown: 'hometown',
    current_address: 'current_address',
    occupation: 'occupation',
    company: 'company',
    education: 'education',
    biography: 'biography',
    notes: 'notes',
    gender: 'gender',
    is_living: 'is_living',
};

/**
 * Telegram Webhook handler
 * Receives callback_query from Telegram when admin presses ✅ Duyệt or ❌ Từ chối
 */
export async function POST(request: NextRequest) {
    try {
        // Verify webhook secret (optional but recommended)
        const secretToken = request.headers.get('x-telegram-bot-api-secret-token');
        const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
        if (expectedSecret && secretToken !== expectedSecret) {
            return NextResponse.json({ error: 'Invalid secret' }, { status: 403 });
        }

        const body = await request.json();

        // Only handle callback_query (button presses)
        const callbackQuery = body.callback_query;
        if (!callbackQuery) {
            // Ignore other updates (messages, etc)
            return NextResponse.json({ ok: true });
        }

        const callbackId = callbackQuery.id;
        const data = callbackQuery.data as string; // e.g. "approve:person-handle:1234567890"
        const message = callbackQuery.message;
        const messageId = message?.message_id;
        const chatId = message?.chat?.id;

        // Parse callback data
        const parts = data.split(':');
        if (parts.length < 3) {
            await answerCallbackQuery(callbackId, '❌ Dữ liệu không hợp lệ');
            return NextResponse.json({ ok: true });
        }

        const action = parts[0]; // "approve" or "reject"
        const personHandle = parts.slice(1, -1).join(':'); // handle may contain colons
        const batchTs = parts[parts.length - 1]; // timestamp

        if (!['approve', 'reject'].includes(action)) {
            await answerCallbackQuery(callbackId, '❌ Hành động không hợp lệ');
            return NextResponse.json({ ok: true });
        }

        const admin = getAdmin();

        // Find pending contributions for this person
        // Subtract 60s buffer from batchTs to account for clock skew between
        // the client (Date.now()) and Supabase server (DEFAULT now())
        const batchDate = new Date(parseInt(batchTs) - 60_000);
        const { data: contributions, error } = await admin
            .from('contributions')
            .select('*')
            .eq('person_handle', personHandle)
            .eq('status', 'pending')
            .gte('created_at', batchDate.toISOString())
            .order('created_at', { ascending: true });

        console.log(`[Telegram Webhook] ${action} for ${personHandle}, batchTs=${batchTs}, found=${contributions?.length ?? 0}`);

        if (error) {
            console.error('[Telegram Webhook] DB error:', error);
            await answerCallbackQuery(callbackId, '❌ Lỗi database');
            return NextResponse.json({ ok: true });
        }

        if (!contributions || contributions.length === 0) {
            await answerCallbackQuery(callbackId, 'ℹ️ Không còn đóng góp nào chờ duyệt');
            if (messageId && chatId) {
                const originalText = message.text || '';
                await editTelegramMessage(messageId, chatId,
                    originalText + '\n\n⚠️ <i>Đã được xử lý trước đó</i>'
                );
            }
            return NextResponse.json({ ok: true });
        }

        const personName = contributions[0].person_name || personHandle;

        if (action === 'approve') {
            // Apply each field to people table + mark as approved
            for (const c of contributions) {
                const dbField = PEOPLE_FIELD_MAP[c.field_name];
                if (dbField) {
                    let val: any = c.new_value || null;
                    if (['birth_year', 'death_year', 'gender'].includes(c.field_name)) {
                        val = parseInt(c.new_value) || null;
                    } else if (c.field_name === 'is_living') {
                        val = c.new_value === 'true';
                    }
                    await admin.from('people').update({ [dbField]: val }).eq('handle', c.person_handle);
                }
                await admin.from('contributions').update({
                    status: 'approved',
                    admin_note: 'Duyệt từ Telegram',
                    reviewed_at: new Date().toISOString(),
                }).eq('id', c.id);
            }

            await answerCallbackQuery(callbackId, `✅ Đã duyệt ${contributions.length} thay đổi!`);

            // Update message
            if (messageId && chatId) {
                const fieldNames = contributions.map(c => c.field_label || c.field_name).join(', ');
                await editTelegramMessage(messageId, chatId,
                    `✅ <b>Đã duyệt</b> ${contributions.length} thay đổi cho <b>${personName}</b>\n\n` +
                    `📋 ${fieldNames}\n` +
                    `⏰ ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`
                );
            }
        } else {
            // Reject all
            for (const c of contributions) {
                await admin.from('contributions').update({
                    status: 'rejected',
                    admin_note: 'Từ chối từ Telegram',
                    reviewed_at: new Date().toISOString(),
                }).eq('id', c.id);
            }

            await answerCallbackQuery(callbackId, `❌ Đã từ chối ${contributions.length} thay đổi`);

            if (messageId && chatId) {
                const fieldNames = contributions.map(c => c.field_label || c.field_name).join(', ');
                await editTelegramMessage(messageId, chatId,
                    `❌ <b>Đã từ chối</b> ${contributions.length} thay đổi cho <b>${personName}</b>\n\n` +
                    `📋 ${fieldNames}\n` +
                    `⏰ ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`
                );
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error('[Telegram Webhook] Error:', error);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
