import logger from '@repo/logger';
import { Document } from '@repo/types';
import { Browser, chromium } from 'playwright';

export const playwrightEngine = async (
	url: string,
	takeFullScreenshot?: boolean,
	options?: {
		timeout?: number;
	},
): Promise<Document> => {
	let browser: Browser | null = null;
	try {
		// browser setup
		logger.info('===starting chromium browser===');

		browser = await chromium.launch();
		const page = await browser.newPage();

		logger.info(`navigating browser page to: ${url}`);
		await page.goto(url, {
			waitUntil: 'networkidle',
			timeout: options?.timeout ? options.timeout : 10000,
		});

		// scrape
		logger.info('scraping html');
		const html = await page.content();

		// take screenshot if asked for
		let screenshot: string | null = null;
		if (takeFullScreenshot) {
			logger.info('taking screenshot');
			const buffer = await page.screenshot({
				fullPage: true,
			});
			console.log('converting to base64');
			screenshot = buffer.toString();
		}

		// close the browser
		logger.info('===closing chromium browser===');
		await browser.close();

		// return results
		return {
			url,
			html,
			...(screenshot ? { screenshot } : {}),
		};
	} catch (err) {
		if (browser) {
			try {
				logger.error(
					'error occured while using browser for scraping\nclosing browser now...',
				);
				await browser.close();
				browser = null;
			} catch {
				logger.error(
					'error occured while closing broswer\nforcefully setting the browser to null',
				);
				browser = null;
				// do nothing with the error at this point
			}
		}
		if (err instanceof Error)
			throw new Error(
				`error occured while scraping: ${url}\nError: ${err.message}`,
			);
		else throw err;
	}
};
