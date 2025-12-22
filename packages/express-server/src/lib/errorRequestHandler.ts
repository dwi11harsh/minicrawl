import { logger } from '@mc/logger';
import { type ErrorRequestHandler } from 'express';

export const ErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
	const message = err instanceof Error ? err.message : 'undefined';
	logger.error(
		`internal server error occured ${message} \n ${{ error: err, stack: err.stack }}`,
		'red',
	);
	res.status(500).json({
		error: 'Internal Server Error',
		message,
	});
};
