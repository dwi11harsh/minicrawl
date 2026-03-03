import createLogger from '@mc/logger';
import type { ScrapeEngineResponse } from '@mc/types';
import type { Page } from 'patchright';

const logger = createLogger('[html scraper function]');

export const webpageScraper = async (
	page: Page,
	url: string,
): Promise<ScrapeEngineResponse> => {
	// 1. initialize variable to add response to
	const result: ScrapeEngineResponse = {
		url: url,
		success: false,
		status: 500,
		error: undefined,
	};

	// 2. try to get response using page
	try {
		const response = await page.goto(url, {
			waitUntil: 'networkidle',
		});

		if (response) {
			// basic info
			result.url = response.url();
			result.status = response.status();
			result.statusText = response.statusText();
			result.success = result.status >= 200 && result.status < 300;

			if (result.success) {
				// if we successfully got the response then...
			}
		}
	} catch (err) {
		result.error = (err as any).message;
		logger.error(`${(err as any).message}`);
	}

	return result;
};
