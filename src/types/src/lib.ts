import type {
	BatchScrapeRequestSchema,
	CrawlRequestSchema,
	ScrapeRequestType,
} from '@mc/types';
import type { Metadata } from './Engine';

export type JobState = 'pending' | 'processing' | 'completed';

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

export interface CleanHtmlOptions {
	baseUrl: string;
	/**
	 * if keepOnlyTags is given an array of tags then removeTags and rest of tags won't be considered and all other tags will be removed
	 */
	keepOnlyTags?: string[];
	/**
	 * keepTags will be removed from the list of tags which are about to be removed for sanitization
	 */
	keepTags?: string[];
	removeTags?: string[];
	removeAttributePatterns?: RegExp[];
	extractMetadata?: boolean;
	extractImages?: boolean;
	extractLinks?: boolean;
}

// main array - (keepTags - (removeTags + alwaysRemoveTags))
