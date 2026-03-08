import { logger } from '@repo/logger';
import fs from 'fs';
import { chromium, type BrowserContext } from 'patchright';
import * as path from 'path';

const browserDataPath = path.join(__dirname, '../../../../browser-data');

let context: BrowserContext | null = null;
let initBrowserPromise: Promise<BrowserContext> | null = null;

export const getBrowserContext = async (
	headless: boolean = false,
): Promise<BrowserContext> => {
	if (context) return context;

	// launch in progress
	if (initBrowserPromise) return initBrowserPromise;

	try {
		const launchOptions = {
			channel: 'chrome', // chrome gives better stealth than chromium
			headless, // non-headless -> harder to detect
		} as const;

		initBrowserPromise = chromium.launchPersistentContext(
			browserDataPath, // path to store all cookies
			{
				...launchOptions,
			},
		);

		context = await initBrowserPromise;
		initBrowserPromise = null;

		context.on('close', () => {
			logger.warn('⚠️ browser context closed unexpectedly');
			context = null;
			initBrowserPromise = null;
		});

		return context;
	} catch (e) {
		initBrowserPromise = null;
		logger.error('❗️error getting browser', (e as any).message);

		// single retry
		try {
			fs.rmSync(browserDataPath, {
				recursive: true,
				force: true,
			});
			logger.info('browser data has been cleared...');

			// with 'chromium' channel as 'chrome' might be the cause of the error
			initBrowserPromise = chromium.launchPersistentContext(
				browserDataPath,
				{
					channel: 'chromium',
					headless,
				},
			);

			context = await initBrowserPromise;

			initBrowserPromise = null;

			context.on('close', () => {
				logger.warn('⚠️ browser context closed unexpectedly');
				context = null;
				initBrowserPromise = null;
			});
			return context;
		} catch (retryError) {
			initBrowserPromise = null;
			logger.error(
				'❗️ browser launch failed after retry',
				(retryError as any).message,
			);
			throw new Error('could not launch browser context');
		}
	}
};
