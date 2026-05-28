import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const blogDir = join(root, 'src/pages/blog');
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

if (!existsSync(distBlogIndex) || !existsSync(distSitemap)) {
	throw new Error('Run npm run build before npm run check:indexing.');
}

const blogIndex = readFileSync(distBlogIndex, 'utf8');
const sitemap = readFileSync(distSitemap, 'utf8');

const astroPages = readdirSync(blogDir)
	.filter((filename) => filename.endsWith('.astro'))
	.filter((filename) => !['index.astro', '[...slug].astro'].includes(filename));

for (const filename of astroPages) {
	const source = readFileSync(join(blogDir, filename), 'utf8');
	const slug = filename.replace(/\.astro$/, '');
	const title = extractConst(source, 'title', filename);
	const pubDate = extractConst(source, 'pubDate', filename);
	const path = `/blog/${slug}/`;
	const absoluteUrl = `https://jackmaguire.org${path}`;

	assertContains(blogIndex, path, 'dist/blog/index.html');
	assertContains(blogIndex, escapeHtml(title), 'dist/blog/index.html');
	assertContains(sitemap, absoluteUrl, 'dist/sitemap-0.xml');

	if (!/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/.test(pubDate)) {
		throw new Error(`${filename} pubDate must use display format like May 27, 2026.`);
	}
}

console.log(`Verified ${astroPages.length} standalone Astro blog pages on /blog and in sitemap.`);
