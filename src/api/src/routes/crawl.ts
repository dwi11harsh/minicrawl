import { getCrawlQueue, queueJobNames } from '@mc/redis';
import { crawlRequestSchema, type CrawlJobForQueue } from '@mc/types';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const crawlRoute = async (request: Request, response: Response) => {
	try {
		// 1. parse incoming request
		const req = crawlRequestSchema.safeParse(request.body);

		if (!req.success) {
			return response.status(400).json({
				success: false,
				message: 'Bad Request',
				error: {
					cause: req.error.cause ? req.error.cause : undefined,
					message: req.error.message
						? req.error.message
						: 'unknown error',
				},
			});
		}
		const data = req.data;

		// 2. create new job id for this request, add metadata and push it to queue
		const jobId = uuidv4();
		const job: CrawlJobForQueue = {
			id: jobId,
			crawlArguments: data,
		};
		const queue = getCrawlQueue();
		await queue.add(queueJobNames.crawl, job);

		// 3. return job id and success true
		return response.status(201).json({
			success: true,
			message: 'a new job request has been created',
			jobid: '12345',
		});
	} catch (e) {
		console.error(`[ERROR OCCURRED IN /crawl]: ${(e as any).message}`);
		return response.status(500).json({
			success: false,
			message: 'Unknown error occurred while processing the request',
			error: (e as any).message,
		});
	}
};
