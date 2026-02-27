import { Queue, type QueueOptions } from 'bullmq';
import { getRedisConnection } from './lib/getRedisConnection';
import createLogger from '@mc/logger';

const logger = createLogger('@mc/redis/index');

let scrapeQueue: Queue | null;
let crawlQueue: Queue | null;
let scrapeDlq: Queue | null;
let crawlDlq: Queue | null;

const scrapeQueueName: string = 'ScrapeQueue';
const crawlQueueName: string = 'CrawlQueue';
const scrapeDlqName: string = 'ScrapeDLQueue';
const crawlDlqName: string = 'CrawlDLQueue';

const initQueues = (
	redisUrl: string,
	defaultQueueJobOptions?: QueueOptions['defaultJobOptions'],
) => {
	scrapeQueue = new Queue(scrapeQueueName, {
		connection: getRedisConnection(redisUrl),
		defaultJobOptions: defaultQueueJobOptions,
	});

	crawlQueue = new Queue(crawlQueueName, {
		connection: getRedisConnection(redisUrl),
		defaultJobOptions: defaultQueueJobOptions,
	});

	scrapeDlq = new Queue(scrapeDlqName, {
		connection: getRedisConnection(redisUrl),
		defaultJobOptions: defaultQueueJobOptions,
	});

	crawlDlq = new Queue(crawlDlqName, {
		connection: getRedisConnection(redisUrl),
		defaultJobOptions: defaultQueueJobOptions,
	});
};

const getScrapeQueue = (): Queue => {
	if (!scrapeQueue)
		throw new Error('init() must be called before using scrape queue.');
	return scrapeQueue;
};

const getCrawlQueue = (): Queue => {
	if (!crawlQueue)
		throw new Error('init() must be called before using scrape queue.');
	return crawlQueue;
};

const getScrapeDlq = (): Queue => {
	if (!scrapeDlq)
		throw new Error('init() must be called before using scrape queue.');
	return scrapeDlq;
};

const getCrawlDlq = (): Queue => {
	if (!crawlDlq)
		throw new Error('init() must be called before using scrape queue.');
	return crawlDlq;
};

const closeQueues = async () => {
	try {
		logger.info('closing Queues');
		await scrapeQueue?.close();
		await crawlQueue?.close();
		await scrapeDlq?.close();
		await crawlDlq?.close();
	} catch (err) {
		logger.error(
			`error occurred while closing queues: ${(err as any).message}`,
		);
	} finally {
		scrapeQueue = null;
		crawlQueue = null;
		scrapeDlq = null;
		crawlDlq = null;
	}
};

export {
	initQueues,
	getScrapeQueue,
	getCrawlQueue,
	getScrapeDlq,
	getCrawlDlq,
	closeQueues,
};
export * from './lib/getRedisConnection';
