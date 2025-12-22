import bodyParser, { urlencoded } from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import { ErrorHandler } from './errorRequestHandler';
import { logMiddleware } from './logMiddleware';

export const CreateServer = (): Express => {
	const app = express();

	app.disable('x-powered-by')
		.use(urlencoded({ extended: true }))
		.use(bodyParser.json())
		.use(cors())
		.use(logMiddleware('API Request'))
		.use(ErrorHandler);

	return app;
};
