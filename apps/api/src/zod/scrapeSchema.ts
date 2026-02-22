import { z } from 'zod';

/**
 * Schema to validate incoming scrape request
 *
 * @property url - must be a valid HTTP/HTTPS URL
 * @property includeFullScreenshot - should full-screen screenshot be included in the response
 * @property includeRawHtml - should raw html be included in response
 * @property includeCleanHtml - should response include clean html
 */
export const scrapeRequestSchema = z.object({
	url: z.url().refine(val => {
		const { protocol, hostname } = new URL(val);

		// only include http and https protocol
		if (protocol === 'http:' || protocol === 'https:') {
			return true;
		} else {
			return false;
		}
	}, 'URL must be valid and start with http:// or https://'),
	includeFullScreenshot: z.boolean().default(false),
	includeRawHtml: z.boolean().default(false),
	includeCleanHtml: z.boolean().default(false),
});

export type ScrapeRequestType = z.infer<typeof scrapeRequestSchema>;
