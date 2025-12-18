import { Document } from '@repo/types';
import { ScrapeRequestSchemaType } from '@repo/zod';
import { fetchWithAxios } from './engines/fetch';
import { playwrightEngine } from './engines/playwright';

type EngineType = 'fetch' | 'playwright' | 'tavily';

const fallbackChains: Record<ScrapeRequestSchemaType['engine'], EngineType[]> =
	{
		fetch: ['fetch', 'playwright', 'tavily'],
		playwright: ['playwright', 'tavily'],
	};

type EngineFn = (
	url: string,
	takeFullScreenshot?: boolean,
	options?: { timeout?: number },
) => Promise<Document | null>;

const engines: Record<EngineType, EngineFn> = {
	fetch: async url => {
		try {
			return await fetchWithAxios(url);
		} catch {
			return null;
		}
	},
	playwright: async (url, takeFullScreenshot) => {
		try {
			if (takeFullScreenshot) {
				return await playwrightEngine(url, takeFullScreenshot);
			} else {
				return await playwrightEngine(url);
			}
		} catch {
			return null;
		}
	},
	tavily: async url => {
		// TODO: implement this
		return null;
	},
};

export const scrapeWithEngine = async (
	url: string,
	engine: ScrapeRequestSchemaType['engine'],
	takeFullScreenshot: boolean,
): Promise<Document> => {
	// if we need to take screenshot we will have to open the playwright browser
	const chain = takeFullScreenshot
		? fallbackChains['playwright']
		: fallbackChains[engine];

	// use each engine with their respective fallbacks
	for (const engineName of chain) {
		const result = await engines[engineName](url, takeFullScreenshot);

		if (result) {
			return result;
		}
	}

	throw new Error(`All engines failed to scrape: ${url}`);
};
