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

const CATEGORY_CONFIG = {
  literature: {
    subcategories: ['Poetry', 'Novels', 'Essays', 'Short Stories', 'Criticism'],
    titles: [
      'Why Contemporary Novels Are Returning to Silence',
      'The New Public Life of Poetry Readings',
      'What Makes an Essay Feel Urgent in 2026',
      'Short Fiction and the Architecture of Surprise',
      'Rereading Classics Through Translation Notes',
      'Narrative Voice and the Ethics of Distance',
      'How Literary Magazines Are Shaping New Writers',
      'The Future of Longform Literary Criticism',
    ],
    subtitles: [
      'A close reading of craft choices and narrative precision.',
      'From editorial process to reader response in the current moment.',
      'How form, voice, and revision shape memorable writing.',
    ],
    tags: ['Books', 'Reading', 'Writing', 'Literary Craft', 'Review'],
  },
  films: {
    subcategories: ['Reviews', 'Trailers', 'Interviews', 'Box Office', 'OTT Releases'],
    titles: [
      'Inside the Editing Rhythm of Neo-Noir Cinema',
      'How Blockbusters Use Silence Before Impact',
      'A Director-Led Shift in Mid-Budget Storytelling',
      'Streaming Premieres and the New Opening Weekend',
      'The Return of Character-First Action Films',
      'Why Cinematography Is Driving Conversation Again',
      'Festival Breakouts That Became Audience Favorites',
      'When Screenplay Structure Defies Genre Rules',
    ],
    subtitles: [
      'A practical film breakdown with production context and audience impact.',
      'Review notes from direction, acting, and visual storytelling perspectives.',
      'From trailer cues to release strategy: what made this film work.',
    ],
    tags: ['Cinema', 'Film Review', 'Direction', 'Screenplay', 'Trailer'],
  },
  artists: {
    subcategories: ['Profiles', 'Exhibitions', 'Interviews', 'Techniques', 'Awards'],
    titles: [
      'The Studio Routine Behind Monumental Canvases',
      'How Young Sculptors Are Using Industrial Waste',
      'Inside a Year-Long Exhibition Preparation Cycle',
      'The Craft Language of Contemporary Printmakers',
      'Why Material Constraints Improve Artistic Clarity',
      'Portraiture Trends Across New Gallery Circuits',
      'Awards Season and the Business of Visibility',
      'Artist Interviews on Process, Failure, and Scale',
    ],
    subtitles: [
      'Documenting process notes, material choices, and exhibition context.',
      'A profile centered on method, medium, and artistic evolution.',
      'Interviews and studio observations from current visual culture.',
    ],
    tags: ['Art', 'Studio', 'Exhibition', 'Interview', 'Practice'],
  },
};

const AUTHORS = [
  { name: 'Anant Kumar', email: 'anant@example.com' },
  { name: 'Mira Sen', email: 'mira@example.com' },
  { name: 'Rahul Das', email: 'rahul@example.com' },
  { name: 'Tanya Roy', email: 'tanya@example.com' },
];

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80',
  'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=1200&q=80',
  'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&q=80',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80',
  'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200&q=80',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1200&q=80',
];

const FILM_DIRECTORS = [
  'Aarav Sen',
  'Maya Kapoor',
  'Nikhil Rao',
  'Rhea Dutta',
  'Kabir Mehta',
  'Leena Roy',
];

const FILM_CAST = [
  'Ishaan Verma',
  'Sara Thomas',
  'Vikram Sethi',
  'Naina Qureshi',
  'Dev Malhotra',
  'Aditi Bose',
  'Arjun Nair',
  'Kriti Paul',
];

const OTT_PLATFORMS = ['Netflix', 'Prime Video', 'JioHotstar', 'Apple TV+', 'Sony LIV'];

const TRAILER_URLS = [
  'https://www.youtube.com/watch?v=8ugaeA-nMTc',
  'https://www.youtube.com/watch?v=TcMBFSGVi1c',
  'https://www.youtube.com/watch?v=6ZfuNTqbHE8',
  'https://www.youtube.com/watch?v=EXeTwQWrcwY',
  'https://www.youtube.com/watch?v=5PSNL1qE6VY',
  'https://www.youtube.com/watch?v=zSWdZVtXT7E',
];

const LITERATURE_GENRES = ['Literary Fiction', 'Speculative', 'Historical', 'Memoir', 'Essay'];
const ART_MEDIUMS = ['Oil on canvas', 'Mixed media', 'Bronze sculpture', 'Digital collage', 'Acrylic'];

function sampleUnique(array, count) {
  const copy = [...array];
  const picked = [];

  while (copy.length > 0 && picked.length < count) {
    const index = randomInt(0, copy.length - 1);
    picked.push(copy[index]);
    copy.splice(index, 1);
  }

  return picked;
}

function randomDateIso(startYear = 2018, endYear = 2026) {
  const start = new Date(`${startYear}-01-01T00:00:00.000Z`).getTime();
  const end = new Date(`${endYear}-12-31T23:59:59.000Z`).getTime();
  return new Date(randomInt(start, end)).toISOString();
}

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

function buildLiteratureContent(title, subcategory) {
  const genre = pick(LITERATURE_GENRES);
  const pages = randomInt(160, 520);
  const readingTime = randomInt(8, 22);

  return {
    time: Date.now(),
    blocks: [
      {
        type: 'header',
        data: { text: title, level: 2 },
      },
      {
        type: 'paragraph',
        data: {
          text: `This ${subcategory.toLowerCase()} feature examines how contemporary authors are reshaping ${genre.toLowerCase()} with sharper structure and stronger editorial discipline.`,
        },
      },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: [
            `Primary genre: ${genre}`,
            `Estimated length: ${pages} pages`,
            `Average reading time: ${readingTime} hours`,
            `Subcategory focus: ${subcategory}`,
          ],
        },
      },
      {
        type: 'quote',
        data: {
          text: 'Great writing is rarely loud; it is precise enough to be remembered.',
          caption: 'Editorial notebook',
          alignment: 'left',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'The strongest sections combine concrete scene detail with conceptual clarity. Instead of over-explaining, the article lets close observation carry interpretation and trusts readers to complete the final step.',
        },
      },
    ],
    version: '2.31.0',
  };
}

function buildFilmContent(title, subcategory) {
  const director = pick(FILM_DIRECTORS);
  const cast = sampleUnique(FILM_CAST, 3);
  const releaseDate = randomDateIso(2023, 2026).slice(0, 10);
  const runtime = randomInt(96, 172);
  const platform = pick(OTT_PLATFORMS);
  const trailer = pick(TRAILER_URLS);
  const budgetCr = randomInt(25, 240);
  const boxOfficeCr = randomInt(40, 520);
  const language = pick(['Hindi', 'English', 'Tamil', 'Telugu', 'Malayalam']);
  const genre = pick(['Drama', 'Thriller', 'Action', 'Sci-Fi', 'Mystery', 'Romance']);
  const rating = (Math.random() * 2 + 3).toFixed(1);
  const cinematographer = pick(['Ira Nair', 'Karan Bhatt', 'Megha Suri', 'Dev Iyer', 'Ritu Arora']);
  const musicDirector = pick(['Ayan Bose', 'Mithun Roy', 'Sahil Khan', 'Aarti Menon', 'Raghav Sen']);

  return {
    time: Date.now(),
    blocks: [
      {
        type: 'header',
        data: { text: title, level: 2 },
      },
      {
        type: 'embed',
        data: {
          service: 'youtube',
          source: trailer,
          embed: trailer,
          width: 640,
          height: 360,
          caption: 'Official trailer',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: `A ${subcategory.toLowerCase()}-focused film write-up covering direction, acting rhythm, and release strategy with audience context.`,
        },
      },
      {
        type: 'paragraph',
        data: {
          text: `Set in a rapidly changing urban landscape, this ${genre.toLowerCase()} title follows a protagonist forced to choose between personal loyalty and public consequence. The script keeps tension high through moral conflict rather than spectacle alone.`,
        },
      },
      {
        type: 'header',
        data: { text: 'Film Details', level: 3 },
      },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: [
            `Release date: ${releaseDate}`,
            `Director: ${director}`,
            `Cast: ${cast.join(', ')}`,
            `Runtime: ${runtime} minutes`,
            `Language: ${language}`,
            `Genre: ${genre}`,
            `OTT platform: ${platform}`,
            `Subcategory: ${subcategory}`,
            `Public rating: ${rating}/5`,
          ],
        },
      },
      {
        type: 'header',
        data: { text: 'Production Credits', level: 3 },
      },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: [
            `Director: ${director}`,
            `Cinematographer: ${cinematographer}`,
            `Music: ${musicDirector}`,
            `Estimated budget: Rs. ${budgetCr} Cr`,
            `Worldwide gross: Rs. ${boxOfficeCr} Cr`,
          ],
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'The film balances spectacle with character motive. Its strongest movement appears in the second act where visual framing narrows and the emotional stakes become intimate without slowing pace.',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'Audience reception has been strongest for performances and pacing. Critically, the movie is being discussed for its editing discipline, tonal consistency, and a final act that resolves emotional arcs without sacrificing narrative momentum.',
        },
      },
    ],
    version: '2.31.0',
  };
}

function buildArtistContent(title, subcategory) {
  const medium = pick(ART_MEDIUMS);
  const exhibitionYear = randomInt(2021, 2026);
  const city = pick(['Mumbai', 'Delhi', 'Bengaluru', 'Kolkata', 'Chennai', 'Hyderabad']);

  return {
    time: Date.now(),
    blocks: [
      {
        type: 'header',
        data: { text: title, level: 2 },
      },
      {
        type: 'paragraph',
        data: {
          text: `This ${subcategory.toLowerCase()} profile documents an artist workflow from sketchbook to exhibition wall, with specific notes on method and revision.`,
        },
      },
      {
        type: 'list',
        data: {
          style: 'unordered',
          items: [
            `Primary medium: ${medium}`,
            `Major exhibition year: ${exhibitionYear}`,
            `Recent exhibition city: ${city}`,
            `Subcategory focus: ${subcategory}`,
          ],
        },
      },
      {
        type: 'quote',
        data: {
          text: 'Material is never neutral; every surface decision changes meaning.',
          caption: 'Studio interview excerpt',
          alignment: 'left',
        },
      },
      {
        type: 'paragraph',
        data: {
          text: 'A consistent thread in the artist practice is disciplined iteration. Early failures are archived, revisited, and transformed into formal decisions that eventually define the final body of work.',
        },
      },
    ],
    version: '2.31.0',
  };
}

function buildEditorContent(title, category, subcategory) {
  if (category === 'films') return buildFilmContent(title, subcategory);
  if (category === 'artists') return buildArtistContent(title, subcategory);
  if (category === 'literature') return buildLiteratureContent(title, subcategory);

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
          text: `${introLine} Subcategory focus: ${subcategory}.`,
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

function createArticle(index, category) {
  const config = CATEGORY_CONFIG[category];
  const subcategory = pick(config.subcategories);
  const titleBase = pick(config.titles);
  const title = `${titleBase} #${index + 1}`;
  const author = pick(AUTHORS);
  const now = daysAgoIso(randomInt(0, 90));
  const isPublished = Math.random() > 0.35;
  const categoryTags = sampleUnique(config.tags, 2);

  const tags = Array.from(new Set([subcategory, ...categoryTags]));

  return {
    title,
    subtitle: pick(config.subtitles),
    slug: `${slugify(title)}-${Date.now()}-${index}`,
    category,
    subcategory,
    tags,
    content: buildEditorContent(title, category, subcategory),
    featured_image_url: pick(IMAGE_POOL),
    status: isPublished ? 'published' : 'draft',
    publish_at: isPublished ? now : null,
    author_name: author.name,
    author_email: author.email,
    created_at: now,
    updated_at: now,
  };
}

async function ensureArticlesTable(supabase) {
  const ddl = `
    create table if not exists public.articles (
      id uuid primary key default gen_random_uuid(),
      title text not null,
      subtitle text,
      slug text not null unique,
      category text not null default 'literature',
      subcategory text not null,
      tags text[] not null default '{}',
      content jsonb not null,
      featured_image_url text,
      status text not null default 'draft' check (status in ('draft', 'published')),
      publish_at timestamptz,
      author_name text,
      author_email text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create index if not exists idx_articles_status on public.articles(status);
    create index if not exists idx_articles_publish_at on public.articles(publish_at);
    create index if not exists idx_articles_category on public.articles(category);
  `;

  const { error } = await supabase.rpc('exec_sql', { sql: ddl });
  if (error) {
    throw new Error(`Failed ensuring articles table: ${error.message}`);
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

  await ensureArticlesTable(supabase);
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const categories = [
    ...Array(20).fill('literature'),
    ...Array(20).fill('films'),
    ...Array(20).fill('artists'),
  ];

  const payload = categories.map((category, index) => createArticle(index, category));

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
