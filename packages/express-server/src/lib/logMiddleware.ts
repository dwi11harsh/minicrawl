import logger from '@mc/logger';
import { NextFunction, Request, Response } from 'express';

export const logMiddleware = (message: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const startTime = Date.now();
		let responseBody: unknown = null;

		logger.log(
			'=========================[STARTING NEW REQUEST]=========================',
			'cyan',
		);
		// capture request info when it comes in
		const clientIp =
			req.ip ||
			req.connection.remoteAddress ||
			req.headers['x-forwarded-for'] ||
			'unknown';
		logger.info(
			`[REQUEST RECIEVED]:${message}\n[ROUTE]:${req.method}\n[ORIGINAL URL]:${req.originalUrl}\n[FROM]:${clientIp}`,
			'gray',
		);

		if (req.body && Object.keys(req.body).length > 0) {
			logger.info(`[REQUEST BODY]: ${req.body}`, 'gray');
		}

		// intercept response body
		const originalSend = res.send;
		const originalJson = res.json;

		res.send = function (body: unknown) {
			responseBody = body;
			return originalSend.call(this, body);
		};

		res.json = function (body: unknown) {
			responseBody = body;
			return originalJson.call(this, body);
		};

		// log after response is sent
		res.on('finish', () => {
			const duration = Date.now() - startTime;

			logger.info(
				`[REQUEST FINISHED]: ${message}\n[COMPLETED IN]: ${duration}ms`,
				'cyan',
			);

			if (responseBody !== null) {
				logger.info(`[RESPONSE BODY]: ${responseBody}`, {
					color: 'gray',
				});
			}
		});
		logger.log(
			'=========================[RESPONSE SENT]=========================',
			'cyan',
		);

		next();
	};
};
