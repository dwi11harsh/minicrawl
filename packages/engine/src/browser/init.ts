import { logger } from '@repo/logger';
import { chromium, type BrowserContext } from 'patchright';
import * as path from 'path';

let browser: BrowserContext | null = null;
const browserDataPath = path.join(__dirname, '../../../../browser-data');

export const getBrowserContext = async (): Promise<BrowserContext> => {
	try {
		const launchOptions = {
			channel: 'chrome', // chrome gives better stealth than chromium
			headless: false, // non-headless -> harder to detect
		} as const;

		browser = await chromium.launchPersistentContext(
			browserDataPath, // path to store all cookies
			{
				...launchOptions,
			},
		);

		return browser;
	} catch (e) {
		logger.error('❗️error getting browser', (e as any).message);
		throw new Error('could not launch browser context');
	}
};
