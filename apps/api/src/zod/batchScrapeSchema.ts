import { z } from 'zod';

/**
 * Schema to validate incoming batch scrape request
 *
 * @property urls - must be a valid array of HTTP/HTTPS URLs
 * @property includeFullScreenshot - should full-screen screenshot be included in the response for each url
 * @property includeHtml - should response include clean html
 * @property includeDiscoveredUrls - should response include an array of urls discovered while scraping the webpage
 * @property ignoreRobotsTxt - should the scraper ignore robots.txt rules
 */

export const batchScrapeRequestSchema = z.object({
	urls: z.array(
		z.url().refine(val => {
			const { protocol } = new URL(val);

			// only include http and https protocol
			if (protocol === 'http:' || protocol === 'https:') {
				return true;
			} else {
				return false;
			}
		}, 'URL must be valid and start with http:// or https://'),
	),
	includeFullScreenshot: z.boolean().default(false),
	includeHtml: z.boolean().default(false),
	includeDiscoveredUrls: z.boolean().default(false),
	ignoreRobotsTxt: z.boolean().default(false),
});

export type BatchScrapeRequestSchema = z.infer<typeof batchScrapeRequestSchema>;
