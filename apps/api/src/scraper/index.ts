import { ValidationError } from '@repo/error';
import { ValidateScrapeRequestSchema } from '@repo/zod';
import { Request, Response } from 'express';

export const scrapeController = async (req: Request, res: Response) => {
	try {
		const { url } = ValidateScrapeRequestSchema(req.body);
	} catch (e: unknown) {
		const message =
			e instanceof ValidationError ? e.message : 'Unknown Error';
		res.json({ success: false, message: message }).status(400);
		return;
	}
};
