import {
	EngineType,
	ScrapeEngineOptions,
	ScrapeEngineResponse,
} from '@repo/types';
import { scrapeWithBrowser } from './browser/scrape';

type EngFunc = (arg: ScrapeEngineOptions) => Promise<ScrapeEngineResponse>;

const EngineRecord: Record<EngineType, EngFunc> = {
	browser: scrapeWithBrowser,
};

export const scrapeWithEngine = async (
	arg: ScrapeEngineOptions,
	engine: EngineType,
): Promise<ScrapeEngineResponse> => {
	const scrapeFunction = EngineRecord[engine];
	const response = await scrapeFunction(arg);

	return response;
};
