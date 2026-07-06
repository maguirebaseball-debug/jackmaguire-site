// @ts-check

import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://jackmaguire.org',
	trailingSlash: 'always',
	output: 'static',
	adapter: vercel(),
	redirects: {
		'/2026/01/24/my-brother-is-building-a-data-platform-for-fishermen-and-its-exposing-how-broken-the-industry-really-is/': '/blog/my-brother-building-data-platform-fishermen',
		'/2026/01/10/william-gaddis-recognitions-my-thoughts/': '/blog/william-gaddis-recognitions',
		'/all-writing/': '/blog/',
		'/blog/ai-ally-betrayal/': '/blog/we-are-all-inside-different-machines/',
		'/nycworldcupopenervenues/': '/worldcupnyc2026/',
	},
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		react(),
		mdx(),
		sitemap({
			filter: (page) =>
				![
				        'https://jackmaguire.org/sobriety/',
				        'https://jackmaguire.org/sobriety-admin/',
				        'https://jackmaguire.org/x/peak/',
				        'https://jackmaguire.org/x/looksmax/',
				        'https://jackmaguire.org/cmo/thank-you/',
				].includes(page),
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Plus Jakarta Sans',
			cssVariable: '--font-heading',
			fallbacks: ['system-ui', 'sans-serif'],
		},
		{
			provider: fontProviders.google(),
			name: 'Plus Jakarta Sans',
			cssVariable: '--font-ui',
			fallbacks: ['system-ui', 'sans-serif'],
		},
	],
});
