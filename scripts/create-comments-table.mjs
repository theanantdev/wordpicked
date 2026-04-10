import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnvFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const idx = trimmed.indexOf('=');
        if (idx === -1) continue;
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!(key in process.env)) process.env[key] = value;
    }
}

function ensureEnv() {
    const cwd = process.cwd();
    loadEnvFile(path.join(cwd, '.env.local'));
    loadEnvFile(path.join(cwd, '.env'));
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    return { supabaseUrl, serviceRoleKey };
}

async function main() {
    const { supabaseUrl, serviceRoleKey } = ensureEnv();
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });

    const ddl = `
        CREATE TABLE IF NOT EXISTS public.comments (
            id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            article_id  uuid NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
            article_slug text NOT NULL,
            article_title text NOT NULL DEFAULT '',
            article_type text NOT NULL DEFAULT 'literature' CHECK (article_type IN ('literature', 'films')),
            name        text NOT NULL,
            email       text NOT NULL,
            message     text NOT NULL,
            status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
            liked       boolean NOT NULL DEFAULT false,
            created_at  timestamptz NOT NULL DEFAULT now()
        );

        CREATE INDEX IF NOT EXISTS idx_comments_article_id ON public.comments(article_id);
        CREATE INDEX IF NOT EXISTS idx_comments_status     ON public.comments(status);
        CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at DESC);
    `;

    const { error } = await supabase.rpc('exec_sql', { sql: ddl });
    if (error) throw new Error(`Migration failed: ${error.message}`);

    const { error: reloadError } = await supabase.rpc('exec_sql', { sql: "select pg_notify('pgrst', 'reload schema');" });
    if (reloadError) console.warn('Schema reload warn:', reloadError.message);

    console.log('✅ comments table created successfully.');
}

main().catch((err) => { console.error('❌', err.message); process.exit(1); });
