import { scrapeWithEngine } from '@repo/engine';
import { logger } from '@repo/logger';
import { MiniResponse, ScrapeEngineResponse } from '@repo/types';
import { BatchScrapeRequestSchema } from '@repo/types/zod';
import { Request, Response } from 'express';

export const V0BatchScrape = async (
	req: Request,
	res: Response<MiniResponse>,
) => {
	const request = BatchScrapeRequestSchema.safeParse(req.body);

	if (!request.success) {
		logger.warn('invalid v0 batch scrape request received: ', req.body);
		return res.status(400).json({
			success: false,
			error: request.error.message,
		});
	}

	const reqArr: Promise<ScrapeEngineResponse>[] = [];

	const reqData = request.data;
	for (const url of reqData.urls) {
		reqArr.push(
			scrapeWithEngine(
				{
					url,
					includeScreenshot: reqData.includeScreenshot,
					includeFullScreenshot: reqData.includeFullScreenshot,
					includeContentInfo: reqData.includeContentInfo,
					includeServerInfo: reqData.includeServerInfo,
				},
				'browser',
			),
		);
	}

	const resData = await Promise.all(reqArr);

	return res.status(201).json({
		success: true,
		data: resData,
	});
};
