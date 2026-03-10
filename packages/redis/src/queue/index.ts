import { logger } from '@repo/logger';
import { Queue } from 'bullmq';
import { createBullMQ } from './create';
import { queueConfig } from './queue.config';

let scrapeDlq: Queue | null;
let crawlQ: Queue | null;
let batchScrapeQ: Queue | null;

export const initQueues = () => {
	logger.info('Initializing Queues');

	scrapeDlq = createBullMQ(
		queueConfig.scrapeDlqConf.name,
		queueConfig.scrapeDlqConf.retry,
	);
	crawlQ = createBullMQ(
		queueConfig.crawlQConf.name,
		queueConfig.crawlQConf.retry,
	);
	batchScrapeQ = createBullMQ(
		queueConfig.batchScrapeQConf.name,
		queueConfig.batchScrapeQConf.retry,
	);
};

export const getScrapeDlq = () => {
	if (!scrapeDlq)
		throw new Error('initQueues() must be called before using queues.');

	return scrapeDlq;
};

export const getCrawlQ = () => {
	if (!crawlQ)
		throw new Error('initQueues() must be called before using queues.');

	return crawlQ;
};

export const getBatchScrapeQ = () => {
	if (!batchScrapeQ)
		throw new Error('initQueues() must be called before using queues.');

	return batchScrapeQ;
};

export * from './queue.config';
