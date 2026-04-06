import { createAdminClient } from '@/utils/supabase/admin';

/**
 * Type definitions
 */
export interface Staff {
    id: string;
    name: string;
    email: string;
    password: string;
    role?: string;
    is_admin?: boolean;
    is_verified: boolean;
    is_blocked: boolean;
    created_at: string;
}

/**
 * Get Supabase admin client for staff/admin lookups.
 */
function getSupabaseClient() {
    return createAdminClient();
}

/**
 * Fetch all staff members
 * Server-side function - never exposed to browser
 */
export async function getInitialStaffData(): Promise<Staff[]> {
    try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from('staff')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching staff:', error);
            return [];
        }

        return data || [];
    } catch (error) {
        console.error('Exception fetching staff:', error);
        return [];
    }
}

/**
 * Get total staff count
 */
export async function getStaffCount(): Promise<number> {
    try {
        const supabase = await getSupabaseClient();
        const { count, error } = await supabase
            .from('staff')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('Error counting staff:', error);
            return 0;
        }
        return count || 0;
    } catch (error) {
        console.error('Exception counting staff:', error);
        return 0;
    }
}

/**
 * Get count of active (unblocked) staff
 */
export async function getActiveStaffCount(): Promise<number> {
    try {
        const supabase = await getSupabaseClient();
        const { count, error } = await supabase
            .from('staff')
            .select('*', { count: 'exact', head: true })
            .eq('is_blocked', false);

        if (error) {
            console.error('Error counting active staff:', error);
            return 0;
        }
        return count || 0;
    } catch (error) {
        console.error('Exception counting active staff:', error);
        return 0;
    }
}

/**
 * Get count of blocked staff
 */
export async function getBlockedStaffCount(): Promise<number> {
    try {
        const supabase = await getSupabaseClient();
        const { count, error } = await supabase
            .from('staff')
            .select('*', { count: 'exact', head: true })
            .eq('is_blocked', true);

        if (error) {
            console.error('Error counting blocked staff:', error);
            return 0;
        }
        return count || 0;
    } catch (error) {
        console.error('Exception counting blocked staff:', error);
        return 0;
    }
}

/**
 * Fetch a staff row by email
 */
export async function getStaffByEmail(email: string): Promise<Staff | null> {
    try {
        const supabase = await getSupabaseClient();
        const { data, error } = await supabase
            .from('staff')
            .select('*')
            .ilike('email', email.trim())
            .maybeSingle();

        if (error) {
            console.error('Error fetching staff by email:', error);
            throw new Error(error.message || 'Failed to fetch staff by email.');
        }

        return data ?? null;
    } catch (error) {
        console.error('Exception fetching staff by email:', error);
        throw error instanceof Error ? error : new Error('Unexpected staff lookup failure.');
    }
}
