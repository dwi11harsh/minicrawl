import { logger } from '@repo/logger';
import {
	ContentInfo,
	ScrapeEngineOptions,
	ScrapeEngineResponse,
	ServerInfo,
} from '@repo/types';
import { Page, Response } from 'patchright';
import { getBrowserContext } from './initBrowser';

let page: Page | null = null;
export const scrapeWithBrowser = async (
	arg: ScrapeEngineOptions,
): Promise<ScrapeEngineResponse> => {
	let result: ScrapeEngineResponse = {
		url: arg.url,
		success: false,
		status: 500,
	};
	if (!page) {
		try {
			const context = await getBrowserContext(arg.browserHeadless);
			page = await context.newPage();
		} catch (e) {
			logger.error('error initializing new browser-page');
			result.error = (e as any).message;
			result.status = 501;
			return result;
		}
	}

	try {
		const response = await page.goto(arg.url, {
			waitUntil: 'networkidle',
		});

		if (response) {
			result.status = response.status();
			result.success = result.status >= 200 && result.status < 300;

			if (result.success) {
				const html = await page.content();

				const contentInfo = arg.includeContentInfo
					? await getContentInfo(page, response)
					: undefined;

				const serverInfo = arg.includeServerInfo
					? await getServerInfo(response)
					: undefined;

				const screenshot = arg.includeScreenshot
					? await getScreenshot(page, arg.includeFullScreenshot)
					: undefined;

				result.data = {
					html,
					contentInfo,
					serverInfo,
					screenshot,
				};
			} else {
				result.error = `HTTP error code: ${result.status} error: ${response.statusText}`;
			}
		}
	} catch (err) {
		result.error = (err as any).message;
		logger.error(`Error getting response: ${(err as any).toString()}`);
	}

	return result;
};

const getContentInfo = async (
	page: Page,
	response: Response,
): Promise<ContentInfo> => {
	const allHeaders = await response.allHeaders();

	const contentType = await page.evaluate(() => document.contentType);
	const lastModified = await page.evaluate(() => document.lastModified);
	const charSet = await page.evaluate(() => document.characterSet);

	return {
		contentType: allHeaders['content-type'] || contentType,
		contentEncoding: allHeaders['content-encoding'],
		lastModified: allHeaders['last-modified'] || lastModified,
		charSet,
		age: allHeaders['age'],
	};
};

const getServerInfo = async (response: Response): Promise<ServerInfo> => {
	const allHeaders = await response.allHeaders();
	const serverAddr = await response.serverAddr();

	return {
		server: allHeaders['server'],
		ip: serverAddr?.ipAddress,
		port: serverAddr?.port?.toString(),
	};
};

const getScreenshot = async (
	page: Page,
	fullPage: boolean,
): Promise<string> => {
	return (await page.screenshot({ fullPage })).toString('base64');
};
