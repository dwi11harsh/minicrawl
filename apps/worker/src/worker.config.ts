import { queueConfig } from '@repo/redis/queue';

export const workerConfig = {
	batchScrape: {
		queueName: queueConfig.batchScrapeQConf.name,
		options: {
			concurrency: 1,
			lockDuration: 60000,
			lockRenewTime: 100000,
			autorun: true,
			useWorkerThreads: false,
		},
		minWorkers: 1,
		maxWorkers: 3,
		concurrencyPerWorker: 3,
	},

	crawl: {
		queueName: queueConfig.crawlQConf.name,
		options: {
			concurrency: 1,
			lockDuration: 60000,
			lockRenewTime: 100000,
			autorun: true,
			useWorkerThreads: false,
		},
		minWorkers: 1,
		maxWorkers: 3,
		concurrencyPerWorker: 3,
	},
	scrapeDl: {
		queueName: queueConfig.scrapeDlqConf.name,
		options: {
			concurrency: 1,
			lockDuration: 60000,
			lockRenewTime: 100000,
			autorun: true,
			useWorkerThreads: false,
		},
		minWorkers: 1,
		maxWorkers: 3,
		concurrencyPerWorker: 3,
	},
} as const;
