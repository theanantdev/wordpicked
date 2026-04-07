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

const OPENING_PARAGRAPHS = [
  'Every meaningful work begins with a period of uncertainty. Before structure appears, there is only observation, fragments of thought, and a question that refuses to disappear. This essay follows that question from first draft to finished form.',
  'Writers often describe the opening movement of an article as a negotiation between intuition and clarity. You know what you feel, but translating that feeling into language demands patience, revision, and a willingness to remove what is merely decorative.',
  'A strong article does not announce its conclusions too early. It builds an argument with detail, contradiction, and evidence, allowing the reader to participate in the process rather than simply consume a verdict.',
];

const CRAFT_PARAGRAPHS = [
  'One recurring pattern among experienced editors is deliberate pacing: short paragraphs for orientation, longer paragraphs for synthesis, and carefully placed transitions that prevent conceptual whiplash. This rhythm keeps complex ideas readable without making them simplistic.',
  'Interviews from the past decade reveal a practical truth: most drafts improve not through grand reinvention, but through local decisions. A verb becomes more precise, a vague sentence gains context, an anecdote is moved to where it can actually carry weight.',
  'Research quality determines argument quality. When references are thin, writing leans on performance. When references are deep, writing can be quieter and still persuasive because each claim is grounded in a traceable chain of reasoning.',
  'Style becomes credible when it serves thought. Decorative language can impress for a paragraph, but only structure sustains attention over a full article. Good prose is not merely beautiful; it is load-bearing.',
  'Readers rarely remember every sentence, but they remember architecture: the hinge where the argument turns, the image that recurs with new meaning, and the final section where separate threads converge into a coherent stance.',
];

const CATEGORY_SECTIONS = {
  literature: {
    headingA: 'Narrative Tempo and the Pressure of Voice',
    headingB: 'Revision as an Ethical Practice',
    quote:
      'A finished text is not the record of certainty; it is the record of disciplined doubt.',
    list: [
      'Track recurring motifs across early and late drafts',
      'Verify tone consistency between sections',
      'Remove summary where analysis can do the work',
      'Preserve ambiguity only when it increases meaning',
    ],
  },
  films: {
    headingA: 'Framing, Duration, and Emotional Geography',
    headingB: 'Editing as the Argument of the Film',
    quote:
      'In cinema, structure is not what follows emotion; structure is what produces emotion.',
    list: [
      'Map visual motifs scene by scene',
      'Identify where pacing shifts alter interpretation',
      'Compare script intention with final cut choices',
      'Document sound design decisions that redirect attention',
    ],
  },
  artists: {
    headingA: 'Studio Rituals and Material Constraints',
    headingB: 'Public Reception Versus Private Process',
    quote:
      'Technique matures when repetition becomes a method of inquiry, not habit.',
    list: [
      'Record iteration cycles for key works',
      'Link material choices to conceptual outcomes',
      'Separate market narrative from studio reality',
      'Trace how failure informs later execution',
    ],
  },
};

function buildEditorContent(title, category) {
  const section = CATEGORY_SECTIONS[category];
  const introLine = `In this article, we explore ${title.toLowerCase()} through close observation, interviews, and historical context.`;
  const opening = pick(OPENING_PARAGRAPHS);
  const craftA = pick(CRAFT_PARAGRAPHS);
  const craftB = pick(CRAFT_PARAGRAPHS.filter((line) => line !== craftA));
  const craftC = pick(CRAFT_PARAGRAPHS.filter((line) => line !== craftA && line !== craftB));

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
          text: introLine,
        },
      },
      {
        type: 'paragraph',
        data: {
          text: opening,
        },
      },
      {
        type: 'header',
        data: {
          text: section.headingA,
          level: 3,
        },
      },
      {
        type: 'paragraph',
        data: {
          text: craftA,
        },
      },
      {
        type: 'paragraph',
        data: {
          text: craftB,
        },
      },
      {
        type: 'quote',
        data: {
          text: section.quote,
          caption: 'Field note',
          alignment: 'left',
        },
      },
      {
        type: 'header',
        data: {
          text: section.headingB,
          level: 3,
        },
      },
      {
        type: 'paragraph',
        data: {
          text: craftC,
        },
      },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: section.list,
        },
      },
      {
        type: 'paragraph',
        data: {
          text:
            'The final lesson is practical: clarity is cumulative. Better inputs, better questions, and better revisions compound over time, turning an initial idea into a durable piece of writing that can survive rereading.',
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
