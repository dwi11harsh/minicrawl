import type { Request, Response } from 'express';

export const batchScrapeRoute = async (req: Request, res: Response) => {
	const requestBody = req.body;

	console.log('/scrape/batch:', requestBody);
	res.json({ message: 'batch scrape working' });
};
