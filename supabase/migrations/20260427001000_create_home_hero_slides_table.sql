create table if not exists public.home_hero_slides (
    id uuid primary key default gen_random_uuid (),
    eyebrow text not null,
    image_url text not null,
    mobile_image_url text not null,
    sort_order integer not null default 0,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_home_hero_slides_active_sort on public.home_hero_slides (
    is_active,
    sort_order,
    created_at
);

drop trigger if exists trg_home_hero_slides_updated_at on public.home_hero_slides;

create trigger trg_home_hero_slides_updated_at
before update on public.home_hero_slides
for each row execute function public.set_updated_at();

insert into
    public.home_hero_slides (
        eyebrow,
        image_url,
        mobile_image_url,
        sort_order,
        is_active
    )
select *
from (
        values (
                'Wordpicked presents', '/home/hero.png', '/home/hero-mobile.png', 1, true
            ), (
                'Literature first', '/home/hero.png', '/home/hero-mobile.png', 2, true
            ), (
                'Cinema in view', '/home/hero.png', '/home/hero-mobile.png', 3, true
            ), (
                'Artists in focus', '/home/hero.png', '/home/hero-mobile.png', 4, true
            )
    ) as seed (
        eyebrow, image_url, mobile_image_url, sort_order, is_active
    )
where
    not exists (
        select 1
        from public.home_hero_slides
    );