import type { ResponseHeaders, ScrapeRequestType } from '@mc/types';
import { getBrowserContext } from '../getBrowserContext';

export const Scraper = async (data: ScrapeRequestType) => {
	const browser = await getBrowserContext();
	const page = await browser.newPage();

	if (data.delay) {
		await page.waitForTimeout(data.delay * 1000);
	}

	const response = await page.goto(data.url, {
		waitUntil: 'networkidle',
	});

	if (response) {
		// Basic Info
		const url = response.url();
		const status = response.status();
		const statusText = response.statusText();

		// Headers
		let responseHeaders: ResponseHeaders | null = null;
		let responseText: any | null = null;
		{
			const allHeaders = await response.allHeaders();
			const serverAddr = await response.serverAddr();
			responseHeaders = {
				contentType: allHeaders['content-type'],
				contentEncoding: allHeaders['content-encoding'],
				dateScraped: allHeaders['date'],
				lastModified: allHeaders['last-modified'],
				server: allHeaders['server'],
				age: allHeaders['age'],
				location: allHeaders['location'],
				serverAddr: {
					IP: serverAddr?.ipAddress,
					PORT: serverAddr?.port,
				},
			};
			responseText = (await response.body()).toString();
			const pageContent = await page.content();

			if (pageContent == responseText) {
				console.log('pageContent == responseText');
			} else {
				console.log(
					'page content: \n',
					pageContent,
					'\nresponse text: \n',
					responseText,
				);
			}
		}

		// now using browser's inner api
		const urlBrowser = page.url();
		const fullHtml = (await page.content()).toString();
		const title = page.evaluate(() => 'document.title');
		const contenttype = page.evaluate(() => 'document.contentType');
		const lastmodified = page.evaluate(() => 'document.lastModified');
		const charSet = page.evaluate(() => 'document.characterSet');
		const referrer = page.evaluate(() => 'document.referrer');
	} else {
		console.log('no response received');
	}

	await browser.close();
	return response;
};

const temp: ScrapeRequestType = {
	url: 'http://example.com',
	includeFullScreenshot: true,
	includeRawHtml: true,
	includeCleanHtml: true,
	includeDiscoveredUrls: true,
	delay: 3,
	ignoreRobotsTxt: true,
	includeMetadata: true,
};

const response = await Scraper(temp);
