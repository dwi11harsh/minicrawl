import { scrapeWithEngine } from '@repo/scraper';
import { ValidateScrapeRequestSchema } from '@repo/zod';
import { Request, Response } from 'express';

export const scrapeController = async (req: Request, res: Response) => {
	try {
		const { url, engine } = ValidateScrapeRequestSchema(req.body);
		const result = await scrapeWithEngine(url, engine);

		res.json(result).status(201);
	} catch (e: unknown) {
		const message = e instanceof Error ? e.message : 'Unknown Error';
		res.status(400).json({
			success: false,
			message: message,
		});
		return;
	}
};
