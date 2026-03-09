import robotsParser from 'robots-parser';

interface RobotsCheckResult {
	url: string;
	allowed: boolean;
}

/**
 * Checks if robots.txt allows the given urls
 *
 * @param urls - for which robots.txt is to be checked
 * @returns Promise<{url:string allowed: bolean}[]>
 */
export const checkRobotsTxt = async (
	urls: string[],
	userAgent: string = '*',
): Promise<RobotsCheckResult[]> => {
	// 1. separate origns: origin to urls map
	const urlMap = new Map<string, string[]>();

	// 2. insert all keys(origins) and urls
	for (const url of urls) {
		const { origin } = new URL(url);
		if (!urlMap.has(origin)) {
			urlMap.set(origin, []);
		}
		// origin is present
		urlMap.get(origin)!.push(url);
	}

	// 3. get all robots.txt files
	const robotsPromises: Promise<{ origin: string; robotsTxt: string }>[] =
		Array.from(urlMap.keys()).map(url => fetchRobotsContent(url));

	const robotsArr = await Promise.all(robotsPromises);

	let result: RobotsCheckResult[] = [];

	// 4. check for each url
	urlMap.forEach((urls, origin) => {
		const response = checkRobotsOrigin(
			origin,
			robotsArr.find(val => val.origin === origin)!.robotsTxt,
			urls,
			userAgent,
		);
		result.push(...response);
	});

	return result;
};

const fetchRobotsContent = async (
	origin: string,
): Promise<{ origin: string; robotsTxt: string }> => {
	try {
		const response = await fetch(`${origin}/robots.txt`);
		if (response.ok) {
			return {
				origin,
				robotsTxt: await response.text(),
			};
		}
	} catch {
		// ignore
	}

	return {
		origin,
		robotsTxt: '',
	};
};

const checkRobotsOrigin = (
	origin: string,
	robotsTxt: string,
	urls: string[],
	userAgent: string,
): { url: string; allowed: boolean }[] => {
	const response: { url: string; allowed: boolean }[] = urls.map(url => ({
		url,
		allowed: true,
	}));
	try {
		const robot = robotsParser(`${origin}/robots.txt`, robotsTxt);

		for (const entry of response) {
			const isAllowed = robot.isAllowed(entry.url, userAgent);
			entry.allowed = isAllowed ?? true;
		}
	} catch {}
	return response;
};
