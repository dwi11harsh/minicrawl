import { logger } from '@repo/logger';
import { BatchScrapeJob, CrawlJob, ScrapeDlqJob } from '@repo/types';
import { Queue } from 'bullmq';
import { createBullMQ } from './create';
import { queueConfig } from './queue.config';

let scrapeDlq: Queue<ScrapeDlqJob> | null;
let crawlQ: Queue<CrawlJob> | null;
let batchScrapeQ: Queue<BatchScrapeJob> | null;

export const initQueues = () => {
	logger.info('Initializing Queues');

	scrapeDlq = createBullMQ<ScrapeDlqJob>(
		queueConfig.scrapeDlqConf.name,
		queueConfig.scrapeDlqConf.retry,
	);
	crawlQ = createBullMQ<CrawlJob>(
		queueConfig.crawlQConf.name,
		queueConfig.crawlQConf.retry,
	);
	batchScrapeQ = createBullMQ<BatchScrapeJob>(
		queueConfig.batchScrapeQConf.name,
		queueConfig.batchScrapeQConf.retry,
	);
};

export const getScrapeDlq = (): Queue<ScrapeDlqJob> => {
	if (!scrapeDlq)
		throw new Error('initQueues() must be called before using queues.');

	return scrapeDlq;
};

export const getCrawlQ = (): Queue<CrawlJob> => {
	if (!crawlQ)
		throw new Error('initQueues() must be called before using queues.');

	return crawlQ;
};

export const getBatchScrapeQ = (): Queue<BatchScrapeJob> => {
	if (!batchScrapeQ)
		throw new Error('initQueues() must be called before using queues.');

	return batchScrapeQ;
};

export * from './queue.config';
