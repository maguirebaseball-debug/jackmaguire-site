const astroPageSources = import.meta.glob('../pages/blog/*.astro', {
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

export function getStandaloneBlogPosts() {
	return Object.entries(astroPageSources)
		.filter(([path]) => !path.includes('/index.astro') && !path.includes('/[...slug].astro'))
		.map(([path, source]) => {
			const slug = path.split('/').at(-1)?.replace('.astro', '');
			const title = extractConst(source as string, 'title');
			const pubDate = extractConst(source as string, 'pubDate');

			if (!slug || !title || !pubDate) {
				throw new Error(`${path} must define const title and const pubDate to appear in blog listings.`);
			}

			return {
				title,
				href: `/blog/${slug}/`,
				pubDate: parseDisplayDate(pubDate),
				category: "Feature essay",
			};
		})
		.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}
