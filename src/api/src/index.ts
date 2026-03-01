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

// 1. initialize logger
const logger = createLogger('@mc/api/index:');

// 2. get redis uri
const remote_redis_uri = `redis://${config.REMOTE_REDIS_USERNAME}:${config.REMOTE_REDIS_PASSWORD}@${config.REMOTE_REDIS_HOST}:${config.REMOTE_REDIS_PORT}`;
const local_redis_uri = `redis://${config.REDIS_USERNAME}:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`;
const redis_uri = config.REDIS === 'local' ? local_redis_uri : remote_redis_uri;

// 3. initilize queues
initQueues(redis_uri);
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queue');
const {} = createBullBoard({
	queues: [
		new BullMQAdapter(getScrapeQueue()),
		new BullMQAdapter(getCrawlQueue()),
		new BullMQAdapter(getScrapeDlq()),
		new BullMQAdapter(getCrawlDlq()),
	],
	serverAdapter,
});

// 4. initialize express
const app: Application = express();

// 5. set middlewares
app.use(bodyParser.json());
// to log response time and set it to the response of all routes
app.use(
	responseTime((req: Request, res: Response, time) => {
		logger.log(
			`[URL]:${req.url} [METHOD]:${req.method} [TIME TAKEN]:${time.toFixed(4)}ms`,
		);
	}),
);
// 6. bullMQ dashboard
app.use(`/admin/${config.BULL_AUTH_KEY}/queue`, serverAdapter.getRouter());

// 7. set routes
app.get('/', (req: Request, res: Response) => {
	res.status(201).json('minicrawl is healty and live');
});

// TODO: add logic to get job state

app.post('/scrape', scrapeRoute);

app.post('/scrape/batch', batchScrapeRoute);

app.post('/crawl', crawlRoute);

app.post('/crawl/sitemap', crawlSitemapRoute);

// 8. intialize server
const server = app.listen(Number(config.PORT), config.HOST, () => {
	logger.info(`access minicrawl at http://${config.HOST}:${config.PORT}`);
	logger.info(
		`access queue dashbaord at http://${config.HOST}:${config.PORT}/admin/queue`,
	);
});

// 9. graceful shutdown on signals
const gracefulShutdown = (signal: keyof ProcessEventMap) => {
	logger.info(`${signal} received, initialising graceful shutdown`);
	closeQueues();
	server.close();
};
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
