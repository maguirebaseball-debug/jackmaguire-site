const blogPageSources = import.meta.glob('../pages/blog/*.astro', {
	query: '?raw',
	import: 'default',
	eager: true,
});

/** Root-level article pages that should appear on /blog and homepage feeds. */
const rootArticleSources = import.meta.glob('../pages/blinded-world-cup-2026.astro', {
	query: '?raw',
	import: 'default',
	eager: true,
});

function extractConst(source: string, name: string) {
	const match = source.match(new RegExp(`const ${name} = (["'])(.*?)\\1;`, 's'));
	return match?.[2];
}

function parseDisplayDate(pubDate: string) {
	return new Date(`${pubDate} 12:00:00 UTC`);
}

function postsFromGlob(
	sources: Record<string, unknown>,
	hrefForSlug: (slug: string) => string,
) {
	return Object.entries(sources)
		.filter(([path]) => !path.includes('/index.astro') && !path.includes('/[...slug].astro'))
		.map(([path, source]) => {
			const slug = path.split('/').at(-1)?.replace('.astro', '');
			const title = extractConst(source as string, 'title');
			const description = extractConst(source as string, 'description');
			const category = extractConst(source as string, 'category') ?? 'Interactive';
			const pubDate = extractConst(source as string, 'pubDate');

			if (!slug || !title || !description || !pubDate) {
				throw new Error(`${path} must define const title, description, and pubDate to appear in blog listings.`);
			}

			return {
				title,
				description,
				href: hrefForSlug(slug),
				pubDate: parseDisplayDate(pubDate),
				category,
			};
		});
}

export function getStandaloneBlogPosts() {
	const blogPosts = postsFromGlob(blogPageSources, (slug) => `/blog/${slug}/`);
	const rootPosts = postsFromGlob(rootArticleSources, (slug) => `/${slug}/`);

	return [...blogPosts, ...rootPosts].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}
