import { Document } from '@repo/types';
import { ScrapeRequestSchemaType } from '@repo/zod';
import { fetchWithAxios } from './engines/fetch';

type EngineType = 'fetch' | 'playwright' | 'tavily';

const fallbackChains: Record<ScrapeRequestSchemaType['engine'], EngineType[]> =
	{
		fetch: ['fetch', 'playwright', 'tavily'],
		playwright: ['playwright', 'tavily'],
	};

type EngineFn = (url: string) => Promise<Document | null>;

const engines: Record<EngineType, EngineFn> = {
	fetch: async url => {
		try {
			return await fetchWithAxios(url);
		} catch {
			return null;
		}
	},
	playwright: async url => {
		// TODO: implement this
		return null;
	},
	tavily: async url => {
		// TODO: implement this
		return null;
	},
};

export const scrapeWithEngine = async (
	url: string,
	engine: ScrapeRequestSchemaType['engine'],
): Promise<Document> => {
	const chain = fallbackChains[engine];

	for (const engineName of chain) {
		const result = await engines[engineName](url);

		if (result) {
			return result;
		}
	}

	throw new Error(`All engines failed to scrape: ${url}`);
};
