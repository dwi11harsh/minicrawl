import createLogger from '@mc/logger';
import { Job } from 'bullmq';

const logger = createLogger('@mc/workers/crawl.processor: ');

export const crawlProcessor = async (job: Job) => {
	logger.info(`[Crawl Processor ${job.id}]`);
	const { crawlJob } = job.data;

	try {
		logger.info('crawl starts: ', job.id);
	} catch (err) {
		logger.error(`Job ${job.id} failed: ${(err as any).message}`);
		throw err; // BullMQ will handle the retry logic
	}
};
