import type { Request, Response } from 'express';
import { batchScrapeRequestSchema } from '../zod';

export const batchScrapeRoute = async (
	request: Request,
	response: Response,
) => {
	try {
		// 1. parse incoming request
		const req = batchScrapeRequestSchema.safeParse(request.body);

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
		console.log(`[NEW SCRAPE REQUEST]: ${JSON.stringify(data)}`);

		// 3. return job id and success true
		return response.status(201).json({
			success: true,
			message: 'a new job request has been created',
			jobid: '12345',
		});
	} catch (e) {
		return response.status(500).json({
			success: false,
			message: 'Unknown error occurred while processing the request',
			error: (e as any).message,
		});
	}
};
