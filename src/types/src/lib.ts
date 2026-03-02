import type {
	BatchScrapeRequestSchema,
	CrawlRequestSchema,
	ScrapeRequestType,
} from '@mc/types';

export type JobState = 'pending' | 'processing' | 'completed';

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
	metadata?: Metadata;
	createdAt: Date;
}

export interface ScrapeJobForQueue {
	id: string;
	createdAt: Date;
	status: JobState;
	scrapeArguments: ScrapeRequestType;
}

export interface CrawlJobForQueue {
	id: string;
	createdAt: Date;
	status: JobState;
	crawlArguments: CrawlRequestSchema;
}

export interface BatchScrapeJobForQueue {
	id: string;
	createdAt: Date;
	status: JobState;
	scrapeArguments: BatchScrapeRequestSchema;
}

export interface CrawlSitemapJobForQueue {
	id: string;
	createdAt: Date;
	status: JobState;
	crawlArguments: CrawlSitemapJobForQueue;
}
