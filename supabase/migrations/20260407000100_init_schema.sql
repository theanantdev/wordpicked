create extension if not exists "pgcrypto";

create table if not exists public.staff (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    email text not null unique,
    password text not null,
    role text not null default 'staff' check (role in ('admin', 'staff')),
    is_admin boolean not null default false,
    is_verified boolean not null default true,
    is_blocked boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

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

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_staff_updated_at on public.staff;

create trigger trg_staff_updated_at
before update on public.staff
for each row execute function public.set_updated_at();

drop trigger if exists trg_articles_updated_at on public.articles;

create trigger trg_articles_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

create index if not exists idx_staff_email on public.staff (email);

create index if not exists idx_staff_is_blocked on public.staff (is_blocked);

create index if not exists idx_staff_role on public.staff (role);

create index if not exists idx_articles_status on public.articles (status);

create index if not exists idx_articles_publish_at on public.articles (publish_at);

create index if not exists idx_articles_category on public.articles (category);

create or replace function public.exec_sql(sql text)
returns void
language plpgsql
security definer
as $$
begin
  execute sql;
end;
$$;

grant execute on function public.exec_sql (text) to service_role;