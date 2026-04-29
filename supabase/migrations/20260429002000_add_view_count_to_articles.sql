alter table public.articles
add column if not exists view_count integer not null default 0;

create index if not exists idx_articles_view_count on public.articles (view_count);