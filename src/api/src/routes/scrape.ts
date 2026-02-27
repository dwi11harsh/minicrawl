import createLogger from '@mc/logger';
import { getScrapeQueue, queueJobNames } from '@mc/redis';
import { scrapeRequestSchema, type ScrapeJobForQueue } from '@mc/types';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger('@mc/api/routes/scrape: ');

export const scrapeRoute = async (request: Request, response: Response) => {
	try {
		// 1. parse incoming request
		const req = scrapeRequestSchema.safeParse(request.body);

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
		const scrapeJob: ScrapeJobForQueue = {
			id: jobId,
			scrapeArguments: data,
		};
		const queue = getScrapeQueue();
		await queue.add(queueJobNames.scrape, scrapeJob);

		logger.info(`job ${jobId} added to scrape queue`);

		// 3. return job id and success true
		return response.status(201).json({
			success: true,
			message: 'job created successfully',
			jobid: jobId,
		});
	} catch (e) {
		return response.status(500).json({
			success: false,
			message: 'Unknown error occurred while processing the request',
			error: (e as any).message,
		});
	}
};
