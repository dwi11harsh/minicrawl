import { BatchScrapeJob } from '@repo/types';
import { Job } from 'bullmq';

export const batchScrapeProcessor = async (job: Job<BatchScrapeJob>) => {
	await job.updateData({
		...job.data,
		status: 'processing',
	});
	const { jobId, createdAt, status, args } = job.data;

	// processor logic
};
