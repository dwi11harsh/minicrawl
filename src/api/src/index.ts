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
import { closeQueues, initQueues } from '@mc/redis';

const remote_redis_uri = `redis://${config.REMOTE_REDIS_USERNAME}:${config.REMOTE_REDIS_PASSWORD}@${config.REMOTE_REDIS_HOST}:${config.REMOTE_REDIS_PORT}`;
const redis_uri = `redis://${config.REDIS_USERNAME}:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`;

initQueues(redis_uri);

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

// routes
app.get('/', (req: Request, res: Response) => {
	res.status(201).json('minicrawl is healty and live');
});

app.post('/scrape', scrapeRoute);

app.post('/scrape/batch', batchScrapeRoute);

app.post('/crawl', crawlRoute);

app.post('/crawl/sitemap', crawlSitemapRoute);

// server
const server = app.listen(Number(config.PORT), config.HOST, () => {
	logger.info(
		`[SERVER STARTS] access minicrawl at http://${config.HOST}:${config.PORT}`,
	);
});

// graceful shutdown on signals
const gracefulShutdown = async (signal: keyof ProcessEventMap) => {
	logger.log('***************\n\n');
	logger.info(`${signal} received, initialising graceful shutdown`);

	await closeQueues();
	server.close();
};

// graceful shutdown
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
