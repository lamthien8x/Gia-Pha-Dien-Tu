/**
 * Telegram Bot notification utility
 * Gửi thông báo đến Telegram khi có sự kiện quan trọng (contribution mới, v.v.)
 * Hỗ trợ inline keyboard để Duyệt/Từ chối ngay trên Telegram.
 */

interface TelegramMessage {
    text: string;
    parse_mode?: 'HTML' | 'MarkdownV2';
}

interface InlineButton {
    text: string;
    callback_data: string;
}

/**
 * Gửi tin nhắn đến Telegram bot
 * Silently fails nếu chưa cấu hình token/chat_id (không throw error)
 */
export async function sendTelegramMessage(text: string, inlineButtons?: InlineButton[][]): Promise<boolean> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    const chatId = process.env.TELEGRAM_CHAT_ID || '';

    if (!botToken || !chatId) {
        console.warn('[Telegram] Chưa cấu hình TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID');
        return false;
    }

    try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const body: Record<string, unknown> = {
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
        };

        if (inlineButtons && inlineButtons.length > 0) {
            body.reply_markup = {
                inline_keyboard: inlineButtons,
            };
        }

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const err = await res.text();
            console.error('[Telegram] Send failed:', err);
            return false;
        }

        return true;
    } catch (error) {
        console.error('[Telegram] Error:', error);
        return false;
    }
}

/**
 * Cập nhật tin nhắn Telegram (dùng sau khi admin bấm nút)
 */
export async function editTelegramMessage(messageId: number, chatId: number, text: string): Promise<boolean> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    if (!botToken) return false;

    try {
        const url = `https://api.telegram.org/bot${botToken}/editMessageText`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                text,
                parse_mode: 'HTML',
                reply_markup: { inline_keyboard: [] }, // Remove buttons after action
            }),
        });
        return res.ok;
    } catch {
        return false;
    }
}

/**
 * Trả lời callback query (bắt buộc để Telegram ngừng hiện loading)
 */
export async function answerCallbackQuery(callbackQueryId: string, text?: string): Promise<boolean> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    if (!botToken) return false;

    try {
        const url = `https://api.telegram.org/bot${botToken}/answerCallbackQuery`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                callback_query_id: callbackQueryId,
                text: text || '',
            }),
        });
        return res.ok;
    } catch {
        return false;
    }
}

/**
 * Thông báo contribution mới cần kiểm duyệt (với nút Duyệt/Từ chối)
 */
export async function notifyNewContribution(contribution: {
    person_handle: string;
    person_name?: string;
    fields: { label: string; old_value?: string | null; new_value: string }[];
    author_email?: string;
    note?: string;
    batch_ts: string; // timestamp to identify this batch
}): Promise<void> {
    const lines = [
        '📝 <b>Đề xuất chỉnh sửa mới</b>',
        '',
        `👤 Thành viên: <b>${contribution.person_name || contribution.person_handle}</b>`,
    ];

    // Show each changed field
    for (const f of contribution.fields.slice(0, 8)) {
        const oldPart = f.old_value ? ` (cũ: ${truncate(f.old_value, 30)})` : '';
        lines.push(`  • <b>${f.label}</b>: ${truncate(f.new_value || '(xoá)', 50)}${oldPart}`);
    }
    if (contribution.fields.length > 8) {
        lines.push(`  ... và ${contribution.fields.length - 8} trường khác`);
    }

    if (contribution.author_email) {
        lines.push('');
        lines.push(`📧 Người gửi: ${contribution.author_email}`);
    }
    if (contribution.note) {
        lines.push(`💬 Ghi chú: ${truncate(contribution.note, 80)}`);
    }

    // Inline keyboard: Approve all / Reject all
    const callbackApprove = `approve:${contribution.person_handle}:${contribution.batch_ts}`;
    const callbackReject = `reject:${contribution.person_handle}:${contribution.batch_ts}`;

    const buttons: InlineButton[][] = [
        [
            { text: '✅ Duyệt tất cả', callback_data: callbackApprove },
            { text: '❌ Từ chối', callback_data: callbackReject },
        ],
    ];

    await sendTelegramMessage(lines.join('\n'), buttons);
}

function truncate(str: string, maxLen: number): string {
    return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}
