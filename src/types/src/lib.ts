import type {
	BatchScrapeRequestSchema,
	CrawlRequestSchema,
	ScrapeRequestType,
} from '@mc/types';

export interface Metadata {
	title?: string;
	description?: string;
	images?: string;
	language?: string;
	keywords?: string[];
}

export interface ScrapeResult {
	url: string;
	rawHtml?: string;
	cleanHtml?: string;
	markdown?: string;
	discoveredUrls?: string[];
	screenshot?: string;
	erroredFields?: string[];
	metadata?: string;
}

export interface ScrapeJobForQueue {
	id: string;
	scrapeArguments: ScrapeRequestType;
}

export interface CrawlJobForQueue {
	id: string;
	crawlArguments: CrawlRequestSchema;
}

export interface BatchScrapeJobForQueue {
	id: string;
	scrapeArguments: BatchScrapeRequestSchema;
}

export interface CrawlSitemapJobForQueue {
	id: string;
	crawlArguments: CrawlSitemapJobForQueue;
}
