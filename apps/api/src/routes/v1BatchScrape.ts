import { logger } from '@repo/logger';
import { BatchScrapeRequestSchema } from '@repo/types/zod';
import { Request, Response } from 'express';

export const V1BatchScrape = async (req: Request, res: Response) => {
	const parse = BatchScrapeRequestSchema.safeParse(req.body);

	if (!parse.success) {
		logger.warn('invalid v1 batch scrape request received: ', req.body);
		return res.status(400).json({
			success: false,
			status: 400,
			error: parse.error.message,
		});
	}

	// do sth with this knowledge boss

	return res.status(201).json({ message: 'got the request bruh' });
};
