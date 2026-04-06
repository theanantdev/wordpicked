import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

/**
 * Type definitions
 */
export interface Staff {
    id: string;
    name: string;
    email: string;
    is_verified: boolean;
    is_blocked: boolean;
    created_at: string;
}

/**
 * Get Supabase server client
 * Uses existing modular client with proper cookie handling
 */
async function getSupabaseClient() {
    const cookieStore = await cookies();
    return createClient(cookieStore);
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
