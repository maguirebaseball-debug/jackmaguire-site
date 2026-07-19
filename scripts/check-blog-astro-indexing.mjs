import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const blogDir = join(root, 'src/pages/blog');
const pagesDir = join(root, 'src/pages');
/** Root-level article pages registered in standaloneBlogPosts (not under /blog/). */
const rootArticleFiles = ['blinded-world-cup-2026.astro'];
const distRoot = existsSync(join(root, 'dist/client')) ? join(root, 'dist/client') : join(root, 'dist');
const distHome = join(distRoot, 'index.html');
const distBlogIndex = join(distRoot, 'blog/index.html');
const distSitemap = join(distRoot, 'sitemap-0.xml');

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

function assertNoBareUrls(source, filename) {
	// Only enforce for essay / citation-heavy standalones (the ones that were bitten by raw HTML pastes of sources lists).
	// Widget/ranking pages legitimately hold bare URLs inside data objects (dish_url, maps urls, etc.).
	const isEssayPage = filename.includes('subagents') || filename.includes('ai-coding-agents') || /Primary Sources|class=\\"prose\\"/.test(source);
	if (!isEssayPage) return;

	// Find http(s)://... that are NOT inside href="..." or src="..." attributes.
	// Ignores safe ones inside our JSON-LD schema blocks.
	const bare = [];
	const re = /https?:\/\/[^\s"'<>`)]+/g;
	let m;
	while ((m = re.exec(source)) !== null) {
		const match = m[0];
		const idx = m.index;
		const preceding = source.slice(Math.max(0, idx - 40), idx);
		if (/href\s*=\s*["']/.test(preceding) || /src\s*=\s*["']/.test(preceding)) continue;
		if (match.includes('schema.org') || match.includes('jackmaguire.org')) continue;
		bare.push(match);
	}
	if (bare.length > 0) {
		throw new Error(
			`${filename} contains bare URL(s) appearing as plain text (not hyperlinked via href or markdown): ${bare.slice(0, 3).join(', ')}${bare.length > 3 ? '...' : ''}. ` +
			`All external URLs in article prose must be proper <a href="..."> or written in a .content.md as [text](url) so marked converts them. ` +
			`Fix the source (or the .content.md) and re-run.`
		);
	}
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
		filename,
		sourcePath: join(blogDir, filename),
	};
});

const rootPosts = rootArticleFiles.map((filename) => {
	const sourcePath = join(pagesDir, filename);
	if (!existsSync(sourcePath)) {
		throw new Error(`Root article missing: ${filename}`);
	}
	const source = readFileSync(sourcePath, 'utf8');
	const slug = filename.replace(/\.astro$/, '');
	const pubDateStr = extractConst(source, 'pubDate', filename);
	const pubDate = new Date(`${pubDateStr} 12:00:00 UTC`);
	return {
		path: `/${slug}/`,
		pubDate,
		filename,
		sourcePath,
		source,
	};
});

// Combine and identify top 6 posts
const allPosts = [...mdPosts, ...astroPosts, ...rootPosts].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
const top6Paths = new Set(allPosts.slice(0, 6).map((p) => p.path));

for (const filename of astroPages) {
	const source = readFileSync(join(blogDir, filename), 'utf8');
	const slug = filename.replace(/\.astro$/, '');
	const title = extractConst(source, 'title', filename);
	const pubDate = extractConst(source, 'pubDate', filename);
	const path = `/blog/${slug}/`;
	const absoluteUrl = `https://jackmaguire.org${path}`;

	assertNoBareUrls(source, filename);

	assertContains(blogIndex, path, `${distRoot}/blog/index.html`);
	assertContains(blogIndex, escapeHtml(title), `${distRoot}/blog/index.html`);
	
	if (top6Paths.has(path)) {
		assertContains(home, path, `${distRoot}/index.html`);
		assertContains(home, escapeHtml(title), `${distRoot}/index.html`);
	}

	assertContains(sitemap, absoluteUrl, `${distRoot}/sitemap-0.xml`);

	if (!/^[A-Z][a-z]+ \d{1,2}, \d{4}$/.test(pubDate)) {
		throw new Error(`${filename} pubDate must use display format like May 27, 2026.`);
	}
}

for (const post of rootPosts) {
	const title = extractConst(post.source, 'title', post.filename);
	const pubDate = extractConst(post.source, 'pubDate', post.filename);
	const absoluteUrl = `https://jackmaguire.org${post.path}`;

	assertNoBareUrls(post.source, post.filename);
	assertContains(blogIndex, post.path, `${distRoot}/blog/index.html`);
	assertContains(blogIndex, escapeHtml(title), `${distRoot}/blog/index.html`);

	if (top6Paths.has(post.path)) {
		assertContains(home, post.path, `${distRoot}/index.html`);
		assertContains(home, escapeHtml(title), `${distRoot}/index.html`);
	}

	assertContains(sitemap, absoluteUrl, `${distRoot}/sitemap-0.xml`);

	if (!/^[A-Z][a-z]+ \d{1,2}, \d{4}$/.test(pubDate)) {
		throw new Error(`${post.filename} pubDate must use display format like May 27, 2026.`);
	}

	const distPage = join(distRoot, post.path.replace(/^\//, ''), 'index.html');
	if (!existsSync(distPage)) {
		throw new Error(`Built page missing for root article: ${distPage}`);
	}
}

console.log(
	`Verified ${astroPages.length} blog Astro pages + ${rootPosts.length} root article page(s) on /blog and in sitemap (including those in homepage top 6). No bare URLs in prose.`,
);
