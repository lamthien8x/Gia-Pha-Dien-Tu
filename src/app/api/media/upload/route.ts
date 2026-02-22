import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const adminClient = createClient(supabaseUrl, supabaseServiceKey);

const ALLOWED_TYPES = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/mpeg', 'video/quicktime',
    'application/pdf'
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const userId = formData.get('userId') as string;
        const title = formData.get('title') as string | null;

        if (!file || !userId) {
            return NextResponse.json(
                { error: 'Missing file or userId' },
                { status: 400 }
            );
        }

        // Validation
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type' },
                { status: 400 }
            );
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { error: 'File size exceeds 10MB limit' },
                { status: 400 }
            );
        }

        // Tạo file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const filePath = `${userId}/${fileName}`;

        // Upload file
        const { data: uploadData, error: uploadError } = await adminClient.storage
            .from('media')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            return NextResponse.json(
                { error: `Upload failed: ${uploadError.message}` },
                { status: 500 }
            );
        }

        // Lưu metadata
        const { data: mediaData, error: dbError } = await adminClient
            .from('media')
            .insert({
                file_name: fileName,
                mime_type: file.type,
                file_size: file.size,
                title: title || file.name,
                state: 'PENDING',
                uploader_id: userId,
            })
            .select()
            .single();

        if (dbError) {
            // Rollback storage upload if DB insert fails
            await adminClient.storage.from('media').remove([filePath]);
            throw dbError;
        }

        // Get public URL
        const { data: urlData } = adminClient.storage
            .from('media')
            .getPublicUrl(filePath);

        return NextResponse.json({
            data: {
                ...mediaData,
                publicUrl: urlData.publicUrl,
            }
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
