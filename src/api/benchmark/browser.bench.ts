import { chromium } from 'patchright';
import * as path from 'path';

const sleep = (time: number) => {
	return new Promise((res, rej) => {
		setTimeout(res, time * 1000);
	});
};

const timings: string[] = [];
const failed: string[] = [];
const BrowserBenchmarks = async (headless: boolean, url: string) => {
	const random = Math.random() * (60 - 30) + 30;
	await sleep(random);
	try {
		// 1. start browser
		const b4browser = new Date();
		const browser = await chromium.launchPersistentContext(
			path.join(process.cwd(), 'browser-data'),
			{
				channel: 'chrome',
				headless,
			},
		);
		const a4browser = new Date();

		// 2. page init
		const b4newpage = new Date();
		const page = await browser.newPage();
		const a4newpage = new Date();

		// 3. nav
		const b4pagegoto = new Date();
		const response = await page.goto(url, {
			waitUntil: 'networkidle',
		});
		const af4pagegoto = new Date();

		let code;
		if (response) {
			code = response.status();
		}
		// 4. pg close
		const b4pageclose = new Date();
		await page.close();
		const af4pageclose = new Date();

		// 5. browser close
		const b4browserclose = new Date();
		await browser.close();
		const af4browserclose = new Date();

		const pad = (n: number) => String(n).padStart(5, '0');
		const tempString = `BROWSER:${pad(a4browser.getTime() - b4browser.getTime())}ms PAGE:${pad(a4newpage.getTime() - b4newpage.getTime())}ms NAV:${pad(af4pagegoto.getTime() - b4pagegoto.getTime())}ms PAGE-CLOSE:${pad(af4pageclose.getTime() - b4pageclose.getTime())}ms BROWSER-CLOSE:${pad(af4browserclose.getTime() - b4browserclose.getTime())}ms HEADLESS:${headless} STATUS:${String(code).padStart(3, '0')} URL:${url}`;
		console.log(tempString);
		timings.push(tempString);
		return;
	} catch (e) {
		failed.push(`URL: ${url}`);
		return;
	}
};

const urls: string[] = [
	'https://example.com/',
	'https://excalidraw.com/',
	'https://www.google.com/',
	'https://github.com/',
	'https://github.com/dwi11harsh',
];

// for each url the tests will be run 10 times with headless false and then 10 times for true

for (let i = 0; i < urls.length; i++) {
	let headless = true;
	for (let j = 0; j < 5; j++) {
		await BrowserBenchmarks(headless, urls[i]!);
	}
	headless = false;
	for (let j = 0; j < 5; j++) {
		await BrowserBenchmarks(headless, urls[i]!);
	}
}

console.log('FINAL TIMINGS in ms\n', timings);
console.log('FAILURES\n', failed);
