import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
dotenv.config({
	path: join(dirname(fileURLToPath(import.meta.url)), '../.env'),
});
import { config } from './config';
import express, {
	type Application,
	type Request,
	type Response,
} from 'express';
import * as bodyParser from 'body-parser';
import responseTime from 'response-time';
import { scrapeRoute } from './routes/scrape';
import { batchScrapeRoute } from './routes/batch-scrape';
import { crawlRoute } from './routes/crawl';
import { crawlSitemapRoute } from './routes/crawl-sitemap';
import createLogger from '@mc/logger';
import type { ProcessEventMap } from 'process';
import {
	closeQueues,
	getCrawlDlq,
	getCrawlQueue,
	getScrapeDlq,
	getScrapeQueue,
	initQueues,
} from '@mc/redis';
import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

const remote_redis_uri = `redis://${config.REMOTE_REDIS_USERNAME}:${config.REMOTE_REDIS_PASSWORD}@${config.REMOTE_REDIS_HOST}:${config.REMOTE_REDIS_PORT}`;
const redis_uri = `redis://${config.REDIS_USERNAME}:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`;

initQueues(redis_uri);
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queue');
const { setQueues, replaceQueues, addQueue, removeQueue } = createBullBoard({
	queues: [
		new BullMQAdapter(getScrapeQueue()),
		new BullMQAdapter(getCrawlQueue()),
		new BullMQAdapter(getScrapeDlq()),
		new BullMQAdapter(getCrawlDlq()),
	],
	serverAdapter,
});

const logger = createLogger('@mc/api/index:');

const app: Application = express();

// middlewares
app.use(bodyParser.json());
app.use(
	responseTime((req: Request, res: Response, time) => {
		logger.log(
			`[URL]:${req.url} [METHOD]:${req.method} [TIME TAKEN]:${time.toFixed(4)}ms`,
		);
	}),
);
app.use('/admin/queue', serverAdapter.getRouter());

// routes
app.get('/', (req: Request, res: Response) => {
	res.status(201).json('minicrawl is healty and live');
});

// TODO: add logic to get job state

app.post('/scrape', scrapeRoute);

app.post('/scrape/batch', batchScrapeRoute);

app.post('/crawl', crawlRoute);

app.post('/crawl/sitemap', crawlSitemapRoute);

// server
const server = app.listen(Number(config.PORT), config.HOST, () => {
	logger.info(`access minicrawl at http://${config.HOST}:${config.PORT}`);
	logger.info(
		`access queue dashbaord at http://${config.HOST}:${config.PORT}/admin/queue`,
	);
});

// graceful shutdown on signals
const gracefulShutdown = (signal: keyof ProcessEventMap) => {
	logger.info(`${signal} received, initialising graceful shutdown`);

	closeQueues();
	server.close();
};

// graceful shutdown
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
