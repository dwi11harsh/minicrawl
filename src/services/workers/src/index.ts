import createLogger from '@mc/logger';
import { getRedisConnection, queueJobNames } from '@mc/redis';
import { Job, Worker } from 'bullmq';
import { crawlProcessor } from './processors/crawl.processor';
import { scrapeProcessor } from './processors/scrape.processor';

const logger = createLogger('@mc/workers/index: ');

const workerConfig = {
	scrape: {
		queueName: queueJobNames.scrape,
		processor: scrapeProcessor,
	},
	crawl: {
		queueName: queueJobNames.crawl,
		processor: crawlProcessor,
	},
} as const;

export type WorkerType = keyof typeof workerConfig;

export const createWorker = (type: WorkerType, redisUrl: string) => {
	const config = workerConfig[type];
	const connection = getRedisConnection(redisUrl);

	const worker = new Worker(
		config.queueName,
		async (job: Job) => {
			return config.processor(job);
		},
		{
			connection,
			concurrency: 1,
		},
	);

	logger.info(
		`Worker (PID: ${process.pid} listening for ${type} jobs on queue: ${config.queueName})`,
	);

	worker.on('completed', job => {
		console.log(`[${process.pid}] Job ${job.id} (${type}) completed.`);
	});

	worker.on('failed', (job, err) => {
		console.error(
			`[${process.pid}] Job ${job?.id} (${type}) failed:`,
			err.message,
		);
	});

	worker.on('error', err => {
		logger.error('Worker error', err);
	});

	process.on('SIGINT', async () => {
		console.log(`[${process.pid}] Received SIGINT, closing worker...`);
		await worker.close();
		process.exit(0);
	});

	return worker;
};
