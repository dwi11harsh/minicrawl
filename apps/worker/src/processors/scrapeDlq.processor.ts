import { ScrapeDlqJob } from '@repo/types';
import { Job } from 'bullmq';

export const scrapeDlqProcessor = async (job: Job<ScrapeDlqJob>) => {
	await job.updateData({
		...job.data,
		status: 'processing',
	});
};
