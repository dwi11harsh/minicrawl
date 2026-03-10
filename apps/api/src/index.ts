import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { logger } from '@repo/logger';
import { getRedisConnection } from '@repo/redis';
import {
	getBatchScrapeQ,
	getCrawlQ,
	getScrapeDlq,
	initQueues,
} from '@repo/redis/queue';
import { globalEnv } from '@repo/types/zod';
import bodyParser from 'body-parser';
import express, { Application } from 'express';
import responseTime from 'response-time';
import v0Router from './router/v0';

const queueBasePath = `/admin/${globalEnv.BULL_AUTH_KEY}/queue`;

const _ = getRedisConnection();
initQueues();
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath(queueBasePath);
const {} = createBullBoard({
	queues: [
		new BullMQAdapter(getScrapeDlq()),
		new BullMQAdapter(getBatchScrapeQ()),
		new BullMQAdapter(getCrawlQ()),
	],
	serverAdapter,
});

const app: Application = express();
app.use(bodyParser.json());
app.use(
	responseTime((req, _, time) => {
		logger.info(
			`[URL]:${req.url} [METHOD]:${req.method} [TIME TAKEN]:${time.toFixed(4)}ms`,
		);
	}),
);
app.disable('x-powered-by');

app.use(queueBasePath, serverAdapter.getRouter());
app.use(v0Router);

app.get('/health', (_, res) => {
	res.status(200).json({
		success: true,
		data: 'minicrawl is live',
	});
});

const server = app.listen(globalEnv.PORT, () => {
	logger.info(`server is live at http://${globalEnv.HOST}:${globalEnv.PORT}`);
	logger.info(
		`access queue dashboard at http://${globalEnv.HOST}:${globalEnv.PORT}${queueBasePath}`,
	);
	logger.info(
		`access redis insights dasboard at http://${globalEnv.HOST}:5540`,
	);
});

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

const gracefulShutdown = (signal: string) => {
	logger.info(
		`${signal} received, initialising graceful shutdown`,
		'-'.repeat(10),
	);

	server.close();
	process.exit(1);
};
