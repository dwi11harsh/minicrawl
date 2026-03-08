import { logger } from '@repo/logger';
import { chromium, type BrowserContext } from 'patchright';
import * as path from 'path';

const browserDataPath = path.join(__dirname, '../../../../browser-data');

let context: BrowserContext | null = null;
let initPromise: Promise<BrowserContext> | null = null;

export const getBrowserContext = async (
	headless: boolean = false,
): Promise<BrowserContext> => {
	if (context) return context;

	// launch in progress
	if (initPromise) return initPromise;

	try {
		const launchOptions = {
			channel: 'chrome', // chrome gives better stealth than chromium
			headless, // non-headless -> harder to detect
		} as const;

		initPromise = chromium.launchPersistentContext(
			browserDataPath, // path to store all cookies
			{
				...launchOptions,
			},
		);

		context = await initPromise;
		initPromise = null;

		context.on('close', () => {
			logger.warn('⚠️ browser context closed unexpectedly');
			context = null;
			initPromise = null;
		});

		return context;
	} catch (e) {
		initPromise = null;
		logger.error('❗️error getting browser', (e as any).message);

		try {
			// single retry
			initPromise = chromium.launchPersistentContext(browserDataPath, {
				channel: 'chrome',
				headless,
			});
			context = await initPromise;
			initPromise = null;
			return context;
		} catch (retryError) {
			initPromise = null;
			logger.error(
				'❗️ browser launch failed after retry',
				(retryError as any).message,
			);
			throw new Error('could not launch browser context');
		}
	}
};
