import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/telegram/setup — Đăng ký webhook với Telegram Bot API
 * Gọi endpoint này 1 lần sau khi deploy (hoặc khi đổi domain)
 * VD: https://your-domain.com/api/telegram/setup
 */
export async function GET(request: NextRequest) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET || '';

    if (!botToken) {
        return NextResponse.json({ error: 'TELEGRAM_BOT_TOKEN chưa được cấu hình' }, { status: 500 });
    }

    // Auto-detect the app URL from the request
    const host = request.headers.get('host') || '';
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || `${proto}://${host}`;

    const webhookUrl = `${appUrl}/api/telegram/webhook`;

    try {
        const body: Record<string, unknown> = {
            url: webhookUrl,
            allowed_updates: ['callback_query'], // Only receive button presses
        };

        if (webhookSecret) {
            body.secret_token = webhookSecret;
        }

        const res = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok || !data.ok) {
            return NextResponse.json({
                error: 'Đăng ký webhook thất bại',
                telegram_response: data,
                webhook_url: webhookUrl,
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Đã đăng ký webhook thành công!',
            webhook_url: webhookUrl,
            telegram_response: data,
        });
    } catch (error: unknown) {
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
