import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getStandaloneBlogPosts } from '../lib/standaloneBlogPosts';

export async function GET(context) {
	const markdownPosts = (await getCollection('blog')).map((post) => ({
		...post.data,
		link: `/blog/${post.id}/`,
	}));
	const standalonePosts = getStandaloneBlogPosts().map((post) => ({
		title: post.title,
		description: post.description,
		pubDate: post.pubDate,
		link: post.href,
	}));
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: [...markdownPosts, ...standalonePosts].sort(
			(a, b) => b.pubDate.valueOf() - a.pubDate.valueOf(),
		),
	});
}
