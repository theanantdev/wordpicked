import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ success: false, error: 'A valid email is required.' }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Check if already exists to provide a friendly message
        const { data: existing } = await supabase
            .from('newsletter_subscriptions')
            .select('id')
            .eq('email', email.toLowerCase())
            .single();

        if (existing) {
            return NextResponse.json({ success: true, message: 'You are already subscribed!' });
        }

        const { error } = await supabase
            .from('newsletter_subscriptions')
            .insert([{ email: email.toLowerCase() }]);

        if (error) throw new Error(error.message);

        return NextResponse.json({ success: true, message: 'Successfully subscribed!' });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Failed to subscribe.' },
            { status: 500 },
        );
    }
}
