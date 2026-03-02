import { chromium, type BrowserContext } from 'patchright';
import * as path from 'path';

let browser: BrowserContext | null = null;

export const getBrowserContext = async (): Promise<BrowserContext> => {
	try {
		const launchOptions = {
			channel: 'chrome', // chrome gives better stealth than chromium
			headless: false, // non-headless -> harder to detect
		} as const;

		browser = await chromium.launchPersistentContext(
			path.join(process.cwd(), 'browser-data'), // path to store all cookies
			{
				...launchOptions,
			},
		);

		return browser;
	} catch (e) {
		console.error('❗️error getting browser', (e as any).message);
		throw new Error('could not launch browser context');
	}
};
