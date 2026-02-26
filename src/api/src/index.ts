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

// graceful shutdown
process.on('SIGINT', () => {
	logger.log('***************');
	logger.info('[SIGINT] recieved, shutting down gracefully');

	// TODO: add closing db connection and redis connection logic

	logger.log('***************');
	server.close();
});

process.on('SIGTERM', () => {
	logger.log('***************');
	logger.log('[SIGTERM] recieved, shutting down gracefully');

	// TODO: add closing db connection and redis connection logic

	logger.log('***************');
	server.close();
});
