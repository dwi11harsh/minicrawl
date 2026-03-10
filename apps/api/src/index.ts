import { logger } from '@repo/logger';
import bodyParser from 'body-parser';
import express, { Application } from 'express';
import responseTime from 'response-time';
import { config } from './config';
import v0Router from './router/v0';

const app: Application = express();
const port = config.PORT;

app.use(bodyParser.json());
app.use(
	responseTime((req, _, time) => {
		logger.info(
			`[URL]:${req.url} [METHOD]:${req.method} [TIME TAKEN]:${time.toFixed(4)}ms`,
		);
	}),
);
app.disable('x-powered-by');

app.use(v0Router);

app.get('/health', (_, res) => {
	res.status(200).json({
		success: true,
		data: 'minicrawl is live',
	});
});

app.listen(port, () => {
	logger.info(`server is live at http://${config.HOST}:${port}`);
});
