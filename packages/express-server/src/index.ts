import logger from '@repo/logger';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { type ErrorRequestHandler, type Express } from 'express';
import { requestTimingMiddleware } from './shared/requestTiming';

export { wrap } from './shared/wrap';

export const createServer = (): Express => {
	const app = express();
	app.disable('x-powered-by')
		// .use(urlencoded({ extended: true }))
		.use(bodyParser.json())
		.use(cors())
		.use(requestTimingMiddleware('v1'))
		.get('/status', (_, res) => {
			return res.json({ ok: true });
		});

	// catches errors thrown by wrap()
	const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
		logger.error(err.stack);
		res.status(500).json({
			error: 'Internal Server Error',
			message:
				process.env.NODE_ENV === 'development'
					? err.message
					: undefined,
		});
	};
	app.use(errorHandler);

	return app;
};
