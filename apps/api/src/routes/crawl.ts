import type { Request, Response } from 'express';

export const crawlRoute = async (req: Request, res: Response) => {
	const requestBody = req.body;

	console.log('/scrape:', requestBody);
	res.json({ message: 'crawl working' });
};
