// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://jackmaguire.org',
	trailingSlash: 'always',
	redirects: {
		'/2026/01/24/my-brother-is-building-a-data-platform-for-fishermen-and-its-exposing-how-broken-the-industry-really-is/': '/blog/my-brother-building-data-platform-fishermen',
		'/2026/01/10/william-gaddis-recognitions-my-thoughts/': '/blog/william-gaddis-recognitions',
		'/all-writing/': '/blog/',
	},
	integrations: [
		mdx(),
		sitemap({
			filter: (page) =>
				![
					'https://jackmaguire.org/sobriety/',
					'https://jackmaguire.org/sobriety-admin/',
				].includes(page),
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Libre Baskerville',
			cssVariable: '--font-heading',
			fallbacks: ['Georgia', 'serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'Merriweather',
			cssVariable: '--font-body',
			fallbacks: ['Georgia', 'serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'IBM Plex Sans',
			cssVariable: '--font-ui',
			fallbacks: ['sans-serif'],
		},
	],
});
