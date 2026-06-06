import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			ogImage: z.string().optional(),
			tags: z.array(z.string()).optional(),
			relatedLinks: z
				.array(
					z.object({
						href: z.string(),
						label: z.string(),
					}),
				)
				.optional(),
		}),
});

const internGuide = defineCollection({
	loader: glob({ base: './src/content/intern-guide', pattern: '**/*.{md,mdx}' }),
	schema: () =>
		z.object({
			title: z.string(),
			description: z.string(),
			category: z.string(),
			order: z.number(),
		}),
});

export const collections = { blog, internGuide };
