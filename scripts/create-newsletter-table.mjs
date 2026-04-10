import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnv() {
    for (const f of ['.env.local', '.env']) {
        const p = path.join(process.cwd(), f);
        if (!fs.existsSync(p)) continue;
        for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
            const t = line.trim();
            if (!t || t.startsWith('#')) continue;
            const i = t.indexOf('=');
            if (i === -1) continue;
            const key = t.slice(0, i).trim();
            const val = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
            if (!(key in process.env)) process.env[key] = val;
        }
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return { url, key };
}

async function main() {
    const { url, key } = loadEnv();
    const supabase = createClient(url, key, { auth: { persistSession: false } });

    console.log('⏳ Creating newsletter_subscriptions table...');
    const { error } = await supabase.rpc('exec_sql', {
        sql: `
            CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                email text UNIQUE NOT NULL,
                created_at timestamptz NOT NULL DEFAULT now()
            );
            
            ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
            
            -- Simple policy to allow admins to see everything
            DROP POLICY IF EXISTS "Admins can view all subscriptions" ON public.newsletter_subscriptions;
            CREATE POLICY "Admins can view all subscriptions" ON public.newsletter_subscriptions
                FOR ALL TO service_role USING (true) WITH CHECK (true);
        `,
    });

    if (error) throw new Error(error.message);
    console.log('✅ newsletter_subscriptions table created.');
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
