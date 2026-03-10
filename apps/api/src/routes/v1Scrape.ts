import { logger } from '@repo/logger';
import { ScrapeRequestSchema } from '@repo/types/zod';
import { Request, Response } from 'express';

export const V1Scrape = async (req: Request, res: Response) => {
	const parse = ScrapeRequestSchema.safeParse(req.body);

	if (!parse.success) {
		logger.warn('invalid v1 scrape request received: ', req.body);
		return res.status(400).json({
			url: req.body?.url ? req.body.url : 'URL Not Found',
			success: false,
			status: 400,
			error: parse.error.message,
		});
	}

	// do sth with this knowledge boss

	return res.status(201).json({ message: 'got the request bruh' });
};
