import { CrawlJob } from '@repo/types';
import { Job } from 'bullmq';

export const crawlProcessor = async (job: Job<CrawlJob>) => {
	await job.updateData({
		...job.data,
		status: 'processing',
	});
};
