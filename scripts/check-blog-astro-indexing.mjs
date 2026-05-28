import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const blogDir = join(root, 'src/pages/blog');
const distHome = join(root, 'dist/index.html');
const distBlogIndex = join(root, 'dist/blog/index.html');
const distSitemap = join(root, 'dist/sitemap-0.xml');

function extractConst(source, name, filename) {
	const match = source.match(new RegExp(`const ${name} = (["'])(.*?)\\1;`, 's'));
	if (!match) {
		throw new Error(`${filename} must define const ${name}.`);
	}
	return match[2];
}

function assertContains(haystack, needle, label) {
	if (!haystack.includes(needle)) {
		throw new Error(`${label} is missing ${needle}.`);
	}
}

function escapeHtml(value) {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

if (!existsSync(distHome) || !existsSync(distBlogIndex) || !existsSync(distSitemap)) {
	throw new Error('Run npm run build before npm run check:indexing.');
}

const home = readFileSync(distHome, 'utf8');
const blogIndex = readFileSync(distBlogIndex, 'utf8');
const sitemap = readFileSync(distSitemap, 'utf8');

const mdBlogDir = join(root, 'src/content/blog');
const astroPages = readdirSync(blogDir)
	.filter((filename) => filename.endsWith('.astro'))
	.filter((filename) => !['index.astro', '[...slug].astro'].includes(filename));

// Extract all markdown posts paths and dates
const mdFiles = readdirSync(mdBlogDir).filter((f) => f.endsWith('.md'));
const mdPosts = mdFiles.map((filename) => {
	const content = readFileSync(join(mdBlogDir, filename), 'utf8');
	const slug = filename.replace(/\.md$/, '');
	const dateMatch = content.match(/pubDate:\s*([\d-]+)/);
	if (!dateMatch) {
		throw new Error(`${filename} is missing pubDate`);
	}
	const pubDate = new Date(`${dateMatch[1]} 12:00:00 UTC`);
	return {
		path: `/blog/${slug}/`,
		pubDate,
	};
});

// Extract all standalone Astro posts paths and dates
const astroPosts = astroPages.map((filename) => {
	const source = readFileSync(join(blogDir, filename), 'utf8');
	const slug = filename.replace(/\.astro$/, '');
	const pubDateStr = extractConst(source, 'pubDate', filename);
	const pubDate = new Date(`${pubDateStr} 12:00:00 UTC`);
	return {
		path: `/blog/${slug}/`,
		pubDate,
	};
});

// Combine and identify top 6 posts
const allPosts = [...mdPosts, ...astroPosts].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
const top6Paths = new Set(allPosts.slice(0, 6).map((p) => p.path));

for (const filename of astroPages) {
	const source = readFileSync(join(blogDir, filename), 'utf8');
	const slug = filename.replace(/\.astro$/, '');
	const title = extractConst(source, 'title', filename);
	const pubDate = extractConst(source, 'pubDate', filename);
	const path = `/blog/${slug}/`;
	const absoluteUrl = `https://jackmaguire.org${path}`;

	assertContains(blogIndex, path, 'dist/blog/index.html');
	assertContains(blogIndex, escapeHtml(title), 'dist/blog/index.html');
	
	if (top6Paths.has(path)) {
		assertContains(home, path, 'dist/index.html');
		assertContains(home, escapeHtml(title), 'dist/index.html');
	}

	assertContains(sitemap, absoluteUrl, 'dist/sitemap-0.xml');

	if (!/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/.test(pubDate)) {
		throw new Error(`${filename} pubDate must use display format like May 27, 2026.`);
	}
}

console.log(`Verified ${astroPages.length} standalone Astro blog pages on /blog and in sitemap (including those in homepage top 6).`);
