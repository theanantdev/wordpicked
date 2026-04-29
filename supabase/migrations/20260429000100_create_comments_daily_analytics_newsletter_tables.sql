create table if not exists public.comments (
    id uuid primary key default gen_random_uuid (),
    article_id uuid not null references public.articles (id) on delete cascade,
    article_slug text not null,
    article_title text not null default '',
    article_type text not null default 'literature' check (
        article_type in ('literature', 'films')
    ),
    name text not null,
    email text not null,
    message text not null,
    status text not null default 'pending' check (
        status in (
            'pending',
            'approved',
            'rejected'
        )
    ),
    liked boolean not null default false,
    created_at timestamptz not null default now()
);

create index if not exists idx_comments_article_id on public.comments (article_id);

create index if not exists idx_comments_status on public.comments (status);

create index if not exists idx_comments_created_at on public.comments (created_at desc);

create table if not exists public.daily_analytics (
    date date primary key,
    views integer not null default 0
);

create table if not exists public.newsletter_subscriptions (
    id uuid primary key default gen_random_uuid (),
    email text unique not null,
    created_at timestamptz not null default now()
);

alter table public.newsletter_subscriptions enable row level security;

drop policy if exists "Admins can view all subscriptions" on public.newsletter_subscriptions;

create policy "Admins can view all subscriptions" on public.newsletter_subscriptions for all to service_role using (true)
with
    check (true);