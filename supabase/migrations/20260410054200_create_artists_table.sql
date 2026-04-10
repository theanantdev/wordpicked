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

drop trigger if exists trg_artists_updated_at on public.artists;

create trigger trg_artists_updated_at
before update on public.artists
for each row execute function public.set_updated_at();

create index if not exists idx_artists_is_featured on public.artists (is_featured);
