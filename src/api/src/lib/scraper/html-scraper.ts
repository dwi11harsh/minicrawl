import createLogger from '@mc/logger';
import type {
	ResponseHeaders,
	ScrapeEngineResponse,
	ScrapeFuncResponse,
} from '@mc/types';
import fs from 'fs';
import type { Page } from 'patchright';
import { cleanHtml } from '../cleanHtml';

const logger = createLogger('[html scraper function]: ');

export const htmlScrapeEngine = async (
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
	let data: ScrapeFuncResponse | undefined = undefined;
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
	} finally {
		if (result.success) {
			result.data = data;
		}
	}

	return result;
};

// const browser = await getBrowserContext();

// const page = await browser.newPage();

// const response = await htmlScrapeEngine(page, 'https://www.firecrawl.dev/');

// await page.close();
// await browser.close();

// if (response.data) {
// 	console.log({
// 		img: response.data.imageUrls,
// 		durls: response.data.discoveredUrls,
// 		// html: response.data.rawHtml,
// 		headers: response.data.responseHeaders,
// 	});

// 	fs.writeFileSync('index.html', response.data.rawHtml!);
// } else {
// 	console.log(response.error);
// 	console.log(response.status);
// }

// process.exit(1);

const rawHtml = fs.readFileSync('index.html', 'utf-8');

const newhtml = cleanHtml(rawHtml, 'https://www.firecrawl.dev/');

fs.writeFileSync('new.html', newhtml);
