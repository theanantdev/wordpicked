import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Get Supabase server client using modular initialization
 */
async function getSupabaseClient() {
    const cookieStore = await cookies();
    return createClient(cookieStore);
}

// GET /api/staff - Fetch all staff
export async function GET() {
    try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from('staff')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Error fetching staff:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch staff' },
            { status: 500 }
        );
    }
}

// POST /api/staff - Create new staff
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Insert new staff
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from('staff')
            .insert([
                {
                    name: name.trim(),
                    email: email.trim(),
                    password, // Note: Should be hashed in production
                    is_verified: true,
                    is_blocked: false
                }
            ])
            .select();

        if (error) throw error;

        return NextResponse.json(
            { success: true, data, message: 'Staff created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating staff:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create staff' },
            { status: 500 }
        );
    }
}

// PATCH /api/staff - Update staff (block/unblock)
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, is_blocked } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Staff ID is required' },
                { status: 400 }
            );
        }

        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from('staff')
            .update({ is_blocked })
            .eq('id', id)
            .select();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            data,
            message: is_blocked ? 'Staff blocked successfully' : 'Staff unblocked successfully'
        });
    } catch (error) {
        console.error('Error updating staff:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update staff' },
            { status: 500 }
        );
    }
}

// DELETE /api/staff?id=<id> - Delete staff
export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Staff ID is required' },
                { status: 400 }
            );
        }

        const supabase = await getSupabaseClient();
        const { error } = await supabase.from('staff').delete().eq('id', id);

        if (error) throw error;

        return NextResponse.json({
            success: true,
            message: 'Staff deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting staff:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete staff' },
            { status: 500 }
        );
    }
}
