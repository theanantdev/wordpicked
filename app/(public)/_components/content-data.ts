export type StoryCardItem = {
    tag: string;
    title: string;
    image: string;
    summary: string;
    author: string;
    date: string;
    tone: string;
    slug: string;
};

export type ArtistItem = {
    name: string;
    image: string;
    bio: string;
    tone: string;
};

export const literatureCards: StoryCardItem[] = [
    {
        tag: "Fiction",
        title: "The Weight of Silence: A Meditation on Absence",
        slug: "the-weight-of-silence-a-meditation-on-absence",
        image: "/home/Literature/image.png",
        summary:
            "In her latest novel, Elena Morrow crafts a devastating portrait of grief that lingers long after the final page.",
        author: "James Whitfield",
        date: "March 28, 2026",
        tone: "from-amber-700/40 via-zinc-900 to-zinc-950",
    },
    {
        tag: "Poetry",
        title: "Beneath the Surface: Poetry of the Mundane",
        slug: "beneath-the-surface-poetry-of-the-mundane",
        image: "/home/Literature/image1.png",
        summary:
            "A collection that finds extraordinary beauty in everyday moments, containing our perception of what poetry can be.",
        author: "Marcus Rivera",
        date: "March 26, 2026",
        tone: "from-emerald-700/25 via-emerald-950 to-zinc-950",
    },
    {
        tag: "Fiction",
        title: "Cartography of Longing: Maps We Draw in the Dark",
        slug: "cartography-of-longing-maps-we-draw-in-the-dark",
        image: "/home/Literature/image2.png",
        summary:
            "A sprawling, ambitious novel that charts the geography of desire across five continents and four decades.",
        author: "Elena Vasquez",
        date: "March 24, 2026",
        tone: "from-red-700/20 via-zinc-900 to-zinc-950",
    },
];

export const filmCards: StoryCardItem[] = [
    {
        tag: "Drama",
        title: "Echoes in the Dark: Reimagining Film Noir",
        slug: "echoes-in-the-dark-reimagining-film-noir",
        image: "/home/Films/image.png",

        summary:
            "Director Lena Park's debut feature is a stunning visual poem that reworks the noir grammar for a new generation.",
        author: "Sofia Chen",
        date: "March 27, 2026",
        tone: "from-sky-700/20 via-slate-950 to-zinc-950",
    },
    {
        tag: "Documentary",
        title: "The Last Projection: Cinema's Analog Farewell",
        slug: "the-last-projection-cinemas-analog-farewell",
        image: "/home/Films/image1.png",
        summary:
            "A documentary that mourns and celebrates the ghosts of celluloid projection in a relentlessly digital world.",
        author: "Alex Turner",
        date: "March 25, 2026",
        tone: "from-orange-500/40 via-orange-900 to-zinc-950",
    },
    {
        tag: "Experimental",
        title: "Still Life with Shadows",
        slug: "still-life-with-shadows",
        image: "/home/Films/image2.png",

        summary:
            "An experimental short film that blurs the line between photography and cinema, creating something eerily new.",
        author: "Yuki Tanaka",
        date: "March 23, 2026",
        tone: "from-amber-200/15 via-zinc-900 to-black",
    },
];

export const artists: ArtistItem[] = [
    {
        name: "Julian Prentiss",
        image: "/home/Artists/image.png",
        bio: "The architect of light whose latest installation challenges the boundaries of physical perception and digital projection.",
        tone: "from-zinc-600/50 via-zinc-700 to-zinc-900",
    },
    {
        name: "Sophia Moretti",
        image: "/home/Artists/image1.png",
        bio: "Redefining the Italian neo-noir with her latest collection of short stories set in the haunting streets of modern Milan.",
        tone: "from-emerald-700/30 via-emerald-900 to-zinc-900",
    },
    {
        name: "Thomas Alistair",
        image: "/home/Artists/image2.png",
        bio: "The cinematographer behind the most evocative visual languages in European independent cinema over the last decade.",
        tone: "from-cyan-700/20 via-slate-800 to-zinc-900",
    },
];

export const filmReviews = [
    {
        score: "9.2/10",
        title: "Past Lives",
        quote: '"A masterclass in the cinematic use of silence and the space between two people."',
    },
    {
        score: "8.5/10",
        title: "The Zone of Interest",
        quote: '"An auditory assault that forces the viewer to confront the banality of historical horror."',
    },
    {
        score: "8.8/10",
        title: "Anatomy of a Fall",
        quote: '"A deconstruction of truth through the lens of a crumbling domestic architecture."',
    },
];
