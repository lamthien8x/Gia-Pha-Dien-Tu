import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const getAdminClient = () => createClient(supabaseUrl, supabaseServiceKey);

// GET - Lấy danh sách people
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const generation = searchParams.get('generation');
        const surname = searchParams.get('surname');
        const isLiving = searchParams.get('is_living');

        let query = getAdminClient()
            .from('people')
            .select('*')
            .order('generation', { ascending: true })
            .order('handle', { ascending: true });

        if (generation) query = query.eq('generation', parseInt(generation));
        if (surname) query = query.ilike('surname', `%${surname}%`);
        if (isLiving === 'true') query = query.eq('is_living', true);
        if (isLiving === 'false') query = query.eq('is_living', false);

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error: unknown) {
        console.error('API Error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// POST - Tạo person mới
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            handle,
            display_name,
            gender,
            generation,
            surname,
            first_name,
            birth_year,
            death_year,
            is_living,
            phone,
            email,
            current_address,
            hometown,
            occupation,
            notes,
        } = body;

        // Validation
        if (!handle || !display_name || !gender || generation === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: handle, display_name, gender, generation' },
                { status: 400 }
            );
        }

        // Check handle uniqueness
        const { data: existing } = await getAdminClient()
            .from('people')
            .select('handle')
            .eq('handle', handle)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: 'Handle already exists' },
                { status: 400 }
            );
        }

        const { data, error } = await getAdminClient()
            .from('people')
            .insert({
                handle,
                display_name,
                gender,
                generation,
                surname: surname || null,
                first_name: first_name || null,
                birth_year: birth_year || null,
                death_year: death_year || null,
                is_living: is_living !== undefined ? is_living : true,
                phone: phone || null,
                email: email || null,
                current_address: current_address || null,
                hometown: hometown || null,
                occupation: occupation || null,
                notes: notes || null,
                families: [],
                parent_families: [],
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error: unknown) {
        console.error('API Error:', error);
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
