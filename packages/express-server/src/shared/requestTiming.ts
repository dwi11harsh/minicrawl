import logger from '@repo/logger';
import { NextFunction, Request, Response } from 'express';

export function requestTimingMiddleware(version: string) {
	return (req: Request, res: Response, next: NextFunction) => {
		const startTime = Date.now();

		// log after response is sent
		res.on('finish', () => {
			const duration = Date.now() - startTime;
			logger.info(
				`[${version}] ${req.method} ${req.path} - ${duration}ms`,
			);
		});

		next();
	};
}
