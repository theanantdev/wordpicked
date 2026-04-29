alter table public.articles
add column if not exists is_pick_of_the_day boolean not null default false;

create index if not exists idx_articles_pick_of_day on public.articles (is_pick_of_the_day);