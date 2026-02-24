import { z } from 'zod';

// TODO: later add user id and api key options along with the logic to adjust for locally running minicrawl

/**
 * Schema to validate incoming scrape request
 *
 * @property url - must be a valid HTTP/HTTPS URL
 * @property includeFullScreenshot - should full-screen screenshot be included in the response
 * @property includeRawHtml - should raw html be included in response
 * @property includeCleanHtml - should response include clean html
 * @property includeDiscoveredUrls - should response include an array of urls discovered while scraping the webpage
 * @property delay - delay between subsequent scrapes
 * @property ignoreRobotsTxt - should the scraper ignore robots.txt rules
 */
export const scrapeRequestSchema = z.object({
	url: z.url().refine(val => {
		const { protocol } = new URL(val);

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
	includeDiscoveredUrls: z.boolean().default(false),
	delay: z.number().min(0).max(10).optional(),
	ignoreRobotsTxt: z.boolean().default(false),
});

export type ScrapeRequestType = z.infer<typeof scrapeRequestSchema>;
