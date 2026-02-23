import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const getAdminClient = () => createClient(supabaseUrl, supabaseServiceKey);

// POST - Dịch chuyển thế hệ (khi thêm thành viên đời trước)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Support both naming conventions to be safe
        const amount = body.amount ?? body.shiftAmount;
        const excludeHandle = body.excludeHandle;

        if (typeof amount !== 'number' || amount === 0) {
            return NextResponse.json(
                { error: 'Invalid shift amount' },
                { status: 400 }
            );
        }

        const adminClient = getAdminClient();

        // Lấy tất cả people
        const { data: people, error: fetchError } = await adminClient
            .from('people')
            .select('handle, generation');

        if (fetchError) throw fetchError;

        if (!people || people.length === 0) {
            return NextResponse.json({ error: 'No people found' }, { status: 404 });
        }

        // Cập nhật generation cho tất cả (ngoại trừ excludeHandle)
        let successCount = 0;
        for (const person of people) {
            if (person.handle === excludeHandle) continue;

            const { error } = await adminClient
                .from('people')
                .update({ generation: person.generation + amount })
                .eq('handle', person.handle);

            if (!error) successCount++;
        }

        return NextResponse.json({
            success: true,
            updated: successCount,
            message: `Đã dịch chuyển ${amount} thế hệ cho ${successCount} thành viên`
        });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
