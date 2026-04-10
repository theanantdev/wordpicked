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
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local/.env or export in your shell.',
    );
  }

  return { supabaseUrl, serviceRoleKey };
}

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const FIRST_NAMES = [
  'Aarav', 'Maya', 'Nikhil', 'Rhea', 'Kabir', 'Leena', 'Ishaan', 'Sara', 'Vikram', 'Naina',
  'Dev', 'Aditi', 'Arjun', 'Kriti', 'Julian', 'Ocean', 'Celine', 'Hanya', 'Zadie', 'Salman'
];

const LAST_NAMES = [
  'Sen', 'Kapoor', 'Rao', 'Dutta', 'Mehta', 'Roy', 'Verma', 'Thomas', 'Sethi', 'Qureshi',
  'Malhotra', 'Bose', 'Nair', 'Paul', 'Prentiss', 'Vuong', 'Song', 'Yanagihara', 'Smith', 'Rushdie'
];

const ART_FORMS = [
  'Poet · Novelist', 'Filmmaker', 'Novelist', 'Sculptor', 'Painter', 'Digital Artist',
  'Performance Artist', 'Composer', 'Playwright', 'Photographer'
];

const QUOTES = [
  'Every poem I\'ve written is an attempt to say something I already know in the most indirect way possible.',
  'Finding the exact right color is like finding the exact right word.',
  'Cinema is a matter of what\'s in the frame and what\'s out.',
  'Words belong to each other.',
  'There is always a gap between intention and effect.',
  'The most important thing in art is The Frame. For painting: literally; for other arts: figuratively.',
  'Art is the eliminating of the unnecessary.',
  'A work of art which did not begin in emotion is not art.',
  'To create one\'s own world takes courage.',
  'Every production of an artist should be the expression of an adventure of his soul.'
];

const BIOGRAPHIES = [
  'Award-winning author and creative writing professor exploring the boundaries of genre.',
  'A visually striking practitioner whose works challenge our perceptions of space.',
  'Internationally recognized for contributions to modern narrative architecture.',
  'Has exhibited in major galleries globally, focusing on identity and dislocation.',
  'Pioneer in combining digital tools with traditional physical mediums.',
  'Their work often explores the intersection of memory, history, and personal trauma.',
  'Recipient of multiple international awards and a prominent voice in contemporary discourse.',
  'Based in New York, their studio practice focuses on long-form iterative pieces.',
  'Known for highly emotional, character-driven storytelling with unique structure.',
  'An emerging talent whose recent debut captivated audiences and critics alike.'
];

const IMAGES = [
  'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
  null,
  null,
  null,
  null
];

const GRADIENTS = [
  "from-[#1a1208] to-[#321e0e]",
  "from-[#08101a] to-[#10203a]",
  "from-[#100a1a] to-[#201535]",
  "from-[#1c2e24] to-[#111e17]"
];

function generateArtist() {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const full_name = `${firstName} ${lastName}`;
  const handle = firstName.toLowerCase() + lastName.toLowerCase();
  
  return {
    full_name,
    art_form: pick(ART_FORMS),
    quote: pick(QUOTES),
    biography: pick(BIOGRAPHIES),
    image_url: pick(IMAGES),
    instagram: `https://instagram.com/${handle}`,
    twitter: `https://twitter.com/${handle}`,
    website: `https://${handle}.com`,
    is_featured: Math.random() > 0.8,
    posts: randomInt(0, 15),
    views: randomInt(100, 5000),
    gradient: pick(GRADIENTS),
  };
}

async function ensureArtistsTable(supabase) {
  const ddl = `
    create table if not exists public.artists (
      id uuid primary key default gen_random_uuid(),
      full_name text not null,
      art_form text not null,
      quote text,
      biography text,
      image_url text,
      instagram text,
      twitter text,
      website text,
      is_featured boolean not null default false,
      posts integer not null default 0,
      views integer not null default 0,
      gradient text not null default 'from-[#1a1208] to-[#321e0e]',
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create index if not exists idx_artists_is_featured on public.artists (is_featured);
  `;

  const { error } = await supabase.rpc('exec_sql', { sql: ddl });
  if (error) {
    throw new Error(`Failed ensuring artists table: ${error.message}`);
  }

  const { error: reloadError } = await supabase.rpc('exec_sql', {
    sql: "select pg_notify('pgrst', 'reload schema');",
  });

  if (reloadError) {
    throw new Error(`Failed to reload schema cache: ${reloadError.message}`);
  }
}

async function main() {
  const { supabaseUrl, serviceRoleKey } = ensureEnv();
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  await ensureArtistsTable(supabase);
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const payload = Array(25).fill(null).map(() => generateArtist());

  const { data, error } = await supabase.from('artists').insert(payload).select('id');

  if (error) {
    throw new Error(`Insert failed: ${error.message}`);
  }

  console.log(`Seeded ${data?.length || 0} dummy artists into public.artists`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
