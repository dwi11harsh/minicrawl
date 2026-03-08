import { logger } from '@repo/logger';
import bodyParser from 'body-parser';
import express, { Application } from 'express';
import { config } from './config';

const app: Application = express();
const port = config.PORT;

app.use(bodyParser.json());
app.disable('x-powered-by');

app.get('/health', (_, res) => {
	res.status(200).json({
		success: true,
		data: 'minicrawl is live',
	});
});

app.listen(port, () => {
	logger.info(`server is live at http://${config.HOST}:${port}`);
});
