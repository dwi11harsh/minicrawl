import z from 'zod';

export const ScrapeRequestSchema = z.object({
	url: z.url(),
	includeScreenshot: z.boolean().default(false),
	includeFullScreenshot: z.boolean().default(false),
	includeContentInfo: z.boolean().default(false),
	includeServerInfo: z.boolean().default(false),
});
