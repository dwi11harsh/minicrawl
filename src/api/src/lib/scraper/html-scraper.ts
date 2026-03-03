import createLogger from '@mc/logger';
import type {
	ResponseHeaders,
	ScrapeEngineResponse,
	ScrapeFuncResponse,
} from '@mc/types';
import type { Page } from 'patchright';

const logger = createLogger('[html scraper function]: ');

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
	let data: ScrapeFuncResponse;
	let rawPageHtml: string | undefined = undefined;
	let rawResponseHtml: string | undefined = undefined;

	// 2. try to get response using page
	try {
		const response = await page.goto(url, {
			waitUntil: 'networkidle',
		});

		if (response) {
			// Check Response
			result.status = response.status();
			result.statusText = response.statusText();
			result.success = result.status >= 200 && result.status < 300;

			if (result.success) {
				// Response Headers & Raw HTML
				const contenttype = await page.evaluate(
					() => document.contentType,
				);
				const lastmodified = await page.evaluate(
					() => document.lastModified,
				);
				const charSet = await page.evaluate(
					() => document.characterSet,
				);
				const referrer = await page.evaluate(() => document.referrer);
				let responseHeaders: ResponseHeaders = {} as ResponseHeaders;
				let screenshot: string | undefined = undefined;
				try {
					const allHeaders = await response.allHeaders();
					const serverAddr = await response.serverAddr();

					responseHeaders = {
						contentType: allHeaders['content-type'] || contenttype,
						contentEncoding: allHeaders['content-encoding'],
						dateScraped: allHeaders['date'],
						lastModified:
							allHeaders['last-modified'] || lastmodified,
						server: allHeaders['server'],
						age: allHeaders['age'],
						location: allHeaders['location'],
						referrer,
						charSet,
						serverAddr: {
							IP: serverAddr?.ipAddress,
							PORT: serverAddr?.port,
						},
					};

					// page content would be the main source and response body is fallback
					rawPageHtml = await page.content();
					rawResponseHtml = (await response.body()).toString();

					screenshot = (
						await page.screenshot({ fullPage: true })
					).toBase64();
				} catch (err) {
					// do nothing if headers could not be extracted
					logger.error(
						`errored while getting headers for ${url}: `,
						(err as any).message,
					);

					// TODO: handle for page content and screenshot
				}

				// URL and headers -> data
				data = {
					url: page.url(),
					responseHeaders,
					rawHtml: rawPageHtml ?? rawResponseHtml,
					screenshot,
				};
			} else {
				result.error = `HTTP error code: ${result.status} error: ${result.statusText}`;
			}
		}
	} catch (err) {
		result.error = (err as any).message;
		logger.error(`${(err as any).message}`);
	}

	return result;
};
