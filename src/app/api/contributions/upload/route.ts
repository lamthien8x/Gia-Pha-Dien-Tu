import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const getAdminClient = () => createClient(supabaseUrl, supabaseServiceKey);

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'Missing file' }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: 'Định dạng ảnh không hợp lệ (hỗ trợ JPG, PNG, WEBP)' }, { status: 400 });
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: 'Kích thước ảnh vượt quá 5MB' }, { status: 400 });
        }

        // Tạo file path - lưu vào bucket 'media', thư mục 'avatars'
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_temp_avatar.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Upload file bằng quyền admin để bypass RLS nếu bucket yêu cầu auth
        const { error: uploadError } = await getAdminClient().storage
            .from('media')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            return NextResponse.json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
        }

        // Get public URL
        const { data: urlData } = getAdminClient().storage
            .from('media')
            .getPublicUrl(filePath);

        return NextResponse.json({ publicUrl: urlData.publicUrl });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
