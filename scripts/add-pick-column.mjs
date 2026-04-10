import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) continue;
    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function ensureEnv() {
  const cwd = process.cwd();
  loadEnvFile(path.join(cwd, '.env.local'));
  loadEnvFile(path.join(cwd, '.env'));
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  return { supabaseUrl, serviceRoleKey };
}

async function main() {
  const { supabaseUrl, serviceRoleKey } = ensureEnv();
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const ddl = `
    ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS is_pick_of_the_day boolean DEFAULT false;
    CREATE INDEX IF NOT EXISTS idx_articles_pick ON public.articles(is_pick_of_the_day);
  `;
  
  const { error } = await supabase.rpc('exec_sql', { sql: ddl });
  if (error) {
    throw new Error(`Failed to alter table: ${error.message}`);
  }
  
  const { error: reloadError } = await supabase.rpc('exec_sql', {
    sql: "select pg_notify('pgrst', 'reload schema');",
  });
  
  if (reloadError) {
    console.warn('Failed to reload schema cache:', reloadError.message);
  }
  console.log('Successfully added is_pick_of_the_day column to articles table.');
}

main().catch(console.error);
