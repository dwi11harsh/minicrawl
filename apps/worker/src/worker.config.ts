import { queueConfig } from '@repo/redis/queue';

export const workerConfig = {
	batchScrape: {
		queueName: queueConfig.batchScrapeQConf.name,
		options: {
			concurrency: 1, // job processed simultaneously within single worker PROCESS
			lockDuration: 60000, // 60 secs
			lockRenewTime: 45000, // 100 secs and needs to be < lockDuration
			autorun: true,
			useWorkerThreads: false,
		},
		minWorkers: 1,
		maxWorkers: 3,
		concurrencyPerWorker: 2, // num of concurrent job each WORKER can handle'

		scaleUpThreshold: 50, // add worker when waiting jobs > 50
		scaleDownThreshold: 10, // remove workers when waiting jobs < 15

		minWaitCount: null, // min no of jobs in queue befor worker can start. if null -> condition ignored
		minWaitTime: null, // min time (in secs) that oldest job waits before worker starts. if null -> condition ignored

		// ❗️be careful brotha
		maxIdleWait: null, // times in secs after which worker -> terminated | if not null then this will take the worker count to zero even if you set minWorkerCount
	},

	crawl: {
		queueName: queueConfig.crawlQConf.name,
		options: {
			concurrency: 1,
			lockDuration: 60000,
			lockRenewTime: 45000,
			autorun: true,
			useWorkerThreads: false,
		},
		minWorkers: 1,
		maxWorkers: 3,

		concurrencyPerWorker: 2,

		scaleUpThreshold: 50,
		scaleDownThreshold: 10,

		minWaitCount: null,
		minWaitTime: null,

		maxIdleWait: null,
	},
	scrapeDl: {
		queueName: queueConfig.scrapeDlqConf.name,
		options: {
			concurrency: 1,
			lockDuration: 60000,
			lockRenewTime: 45000,
			autorun: true,
			useWorkerThreads: false,
		},
		minWorkers: 0,
		maxWorkers: 2,

		concurrencyPerWorker: 3,

		scaleUpThreshold: 50,
		scaleDownThreshold: 10,

		// Conditional Activation: start workers only if queue depth >=15 OR oldest job waiting >300s (in seconds)
		minWaitCount: 15,
		minWaitTime: 300,

		maxIdleWait: 30,
	},
} as const;
