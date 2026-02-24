import { z } from 'zod';

/**
 * @property url - base domain to start the crawl from
 * @property includeScreenshot - should full-screen screenshot be included in the response
 * @property includeHtml - include clean HTML in response
 * @property maxDepth - max depth of the crawl process
 * @property limit - max number of url's to crawl
 * @property ignoreRobotsTxt - ignore robots.txt file at the root of the domain
 * @property allowSubdomains - allow subdomains of of base domain
 * @property delay - delay between subsequent scrapes
 */

export const sitemapCrawlRequestSchema = z.object({
	url: z.url().refine(val => {
		const { protocol } = new URL(val);

		// only include http and https protocol
		if (protocol === 'http:' || protocol === 'https:') {
			return true;
		} else {
			return false;
		}
	}, 'URL must be valid and start with http:// or https://'),
	includeScreenshot: z.boolean().default(false),
	includeHtml: z.boolean().default(false),
	maxDepth: z.number().min(1).default(3),
	limit: z.number().min(1).default(10),
	ignoreRobotsTxt: z.boolean().default(false),
	allowSubdomains: z.boolean().default(false),
	delay: z.number().min(0).max(10).optional(),
});
