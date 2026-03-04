import createLogger from '@mc/logger';
import { Job } from 'bullmq';

const logger = createLogger('@mc/workers/scrape.processor: ');

export const scrapeProcessor = async (job: Job) => {
	logger.info(`[Scrape Processor ${job.id}]`);

	try {
		logger.info('scrape starts: ', job.id);
	} catch (err) {
		logger.error(`Job ${job.id} failed: ${(err as any).message}`);
		throw err; // BullMQ will handle the retry logic
	}
};
