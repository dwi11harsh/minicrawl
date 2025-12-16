import cors from 'cors';
import express, { type Express } from 'express';

export const createServer = (): Express => {
	const app = express();
	app.disable('x-powered-by')
		// .use(urlencoded({ extended: true }))
		.use(express.json())
		.use(cors())
		.get('/status', (_, res) => {
			return res.json({ ok: true });
		});

	return app;
};
