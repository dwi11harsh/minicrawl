import type { Request, Response } from 'express';

export const scrapeRoute = async (req: Request, res: Response) => {
	const requestBody = req.body;

	console.log('/scrape:', requestBody);
	res.json({ message: 'scrape working' });
};
