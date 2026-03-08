import { scrapeWithEngine } from '@repo/engine';
import { logger } from '@repo/logger';
import { ScrapeEngineResponse } from '@repo/types';
import { ScrapeRequestSchema } from '@repo/types/zod';
import { Request, Response } from 'express';

export const V0Scrape = async (
	req: Request,
	res: Response<ScrapeEngineResponse>,
) => {
	const request = ScrapeRequestSchema.safeParse(req.body);

	if (!request.success) {
		logger.warn('invalid v0 scrape request received: ', req.body);
		return res.status(400).json({
			url: 'URL Not Found',
			success: false,
			status: 400,
			error: request.error.message,
		});
	}

	const scrapeResult = await scrapeWithEngine(request.data, 'browser');

	return res.status(scrapeResult.status).json(scrapeResult);
};
