import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const getAdminClient = () => createClient(supabaseUrl, supabaseServiceKey);

// GET - Get person details by handle
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ handle: string }> }
) {
    try {
        const { handle } = await params;

        const { data, error } = await getAdminClient()
            .from('people')
            .select('*')
            .eq('handle', handle)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Person not found' }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json({ data });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}

// PATCH - Update person by handle
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ handle: string }> }
) {
    try {
        const authHeader = request.headers.get('Authorization');
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader || '' } }
        });

        // Verify admin
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        if (!profile?.is_admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { handle } = await params;
        const body = await request.json();

        // Fields allowed to update
        const allowedFields = [
            'display_name', 'gender', 'generation', 'surname', 'first_name',
            'birth_year', 'death_year', 'is_living', 'is_privacy_filtered',
            'phone', 'email', 'zalo', 'facebook', 'current_address', 'hometown',
            'occupation', 'company', 'education', 'nick_name', 'notes', 'biography', 'avatar_url'
        ];

        const updateData: Record<string, any> = {};
        for (const field of allowedFields) {
            if (field in body) {
                updateData[field] = body[field];
            }
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        const { data, error } = await getAdminClient()
            .from('people')
            .update(updateData)
            .eq('handle', handle)
            .select()
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return NextResponse.json({ error: 'Person not found' }, { status: 404 });
            }
            throw error;
        }

        return NextResponse.json({ data });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}

// DELETE - Delete person by handle
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ handle: string }> }
) {
    try {
        const authHeader = request.headers.get('Authorization');
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: authHeader || '' } }
        });

        // Verify admin
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        if (!profile?.is_admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { handle } = await params;
        if (!handle) {
            return NextResponse.json({ error: 'Missing handle string' }, { status: 400 });
        }

        const adminClient = getAdminClient();

        // Check if person exists
        const { data: person } = await adminClient
            .from('people')
            .select('handle, display_name')
            .eq('handle', handle)
            .single();

        if (!person) {
            return NextResponse.json({ error: 'Person not found' }, { status: 404 });
        }

        // Clean up families where this person is the father
        await adminClient
            .from('families')
            .update({ father_handle: null })
            .eq('father_handle', handle);

        // Clean up families where this person is the mother
        await adminClient
            .from('families')
            .update({ mother_handle: null })
            .eq('mother_handle', handle);

        // Find families where this person is a child
        const { data: familiesWithChild } = await adminClient
            .from('families')
            .select('handle, children')
            .contains('children', [handle]);

        if (familiesWithChild && familiesWithChild.length > 0) {
            for (const fam of familiesWithChild) {
                const newChildren = (fam.children as string[]).filter(c => c !== handle);
                await adminClient
                    .from('families')
                    .update({ children: newChildren })
                    .eq('handle', fam.handle);
            }
        }

        // Delete the person
        const { error: deleteError } = await adminClient
            .from('people')
            .delete()
            .eq('handle', handle);

        if (deleteError) {
            throw deleteError;
        }

        return NextResponse.json({ success: true, message: `Đã xóa ${person.display_name}` });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
