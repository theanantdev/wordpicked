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

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgoIso(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

const TITLES = [
  'The Silence Between Notes in Modern Cinema',
  'How Young Poets Are Rewriting City Memory',
  'Inside the Studio Practice of a Reluctant Painter',
  'Why Slow Reading Feels Radical Again',
  'The New Grammar of Independent Films',
  'A Portrait of Risk in Contemporary Fiction',
  'When Archive Becomes Performance',
  'What Makes a Debut Novel Endure',
  'The Return of Intimate Storytelling',
  'How Sound Design Shapes Emotional Time',
  'On Translation, Distance, and Desire',
  'The Craft of Writing After Midnight',
  'A New Generation of Festival Filmmakers',
  'Why We Keep Returning to Short Stories',
  'Painting with Light in Small Theaters',
  'The Future of Literary Journalism',
  'Where Biography Meets Imagination',
  'The Politics of Tenderness in Art',
  'Building Worlds with Minimal Dialogue',
  'The Discipline Behind Poetic Precision',
];

const SUBTITLE_FRAGMENTS = [
  'An in-depth look at process, patience, and ambition.',
  'Conversations from writers, editors, and directors.',
  'A field report from the edge of contemporary culture.',
  'Notes on form, memory, and creative restraint.',
  'A grounded guide to the new creative landscape.',
  'What this shift means for artists and audiences alike.',
  'The practical craft behind the finished work.',
  'A close reading of style, rhythm, and voice.',
];

const AUTHORS = [
  { name: 'Anant Kumar', email: 'anant@example.com' },
  { name: 'Mira Sen', email: 'mira@example.com' },
  { name: 'Rahul Das', email: 'rahul@example.com' },
  { name: 'Tanya Roy', email: 'tanya@example.com' },
];

const CATEGORY_TAGS = {
  literature: ['Fiction', 'Books', 'Essay', 'Narrative', 'Review'],
  films: ['Cinema', 'Direction', 'Screenplay', 'Visuals', 'Festival'],
  artists: ['Studio', 'Exhibition', 'Interview', 'Process', 'Practice'],
};

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
  'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200&q=80',
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&q=80',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80',
  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&q=80',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=80',
];

function buildEditorContent(title, category) {
  const intro = `In this article, we explore ${title.toLowerCase()} through close observation, interviews, and historical context.`;
  const body =
    category === 'films'
      ? 'Directors repeatedly describe editing as the place where a film discovers its final argument. This piece traces that argument from script to screen.'
      : category === 'artists'
        ? 'Studio routines often look repetitive from the outside, but each cycle refines intention. Small decisions accumulate into a distinct visual language.'
        : 'Reading habits shape writing outcomes. By slowing down attention and revisiting structure, authors uncover more deliberate narrative choices.';

  return {
    time: Date.now(),
    blocks: [
      {
        type: 'header',
        data: {
          text: title,
          level: 2,
        },
      },
      {
        type: 'paragraph',
        data: {
          text: intro,
        },
      },
      {
        type: 'paragraph',
        data: {
          text: body,
        },
      },
      {
        type: 'quote',
        data: {
          text: 'Good work is usually the result of disciplined repetition, not sudden inspiration.',
          caption: 'Editorial note',
          alignment: 'left',
        },
      },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: [
            'Context and references',
            'Detailed process notes',
            'Practical takeaways for creators',
          ],
        },
      },
    ],
    version: '2.31.0',
  };
}

function createArticle(index) {
  const titleBase = pick(TITLES);
  const title = `${titleBase} #${index + 1}`;
  const category = pick(['literature', 'films', 'artists']);
  const author = pick(AUTHORS);
  const now = daysAgoIso(randomInt(0, 90));
  const isPublished = Math.random() > 0.35;

  return {
    title,
    subtitle: pick(SUBTITLE_FRAGMENTS),
    slug: `${slugify(title)}-${Date.now()}-${index}`,
    category,
    tags: [pick(CATEGORY_TAGS[category]), pick(CATEGORY_TAGS[category])],
    content: buildEditorContent(title, category),
    featured_image_url: pick(IMAGE_POOL),
    status: isPublished ? 'published' : 'draft',
    publish_at: isPublished ? now : null,
    author_name: author.name,
    author_email: author.email,
    created_at: now,
    updated_at: now,
  };
}

async function main() {
  const { supabaseUrl, serviceRoleKey } = ensureEnv();
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const payload = Array.from({ length: 50 }, (_, index) => createArticle(index));

  const { data, error } = await supabase.from('articles').insert(payload).select('id');

  if (error) {
    throw new Error(`Insert failed: ${error.message}`);
  }

  console.log(`Seeded ${data?.length || 0} dummy articles into public.articles`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
