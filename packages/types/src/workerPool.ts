export interface QueueWorkerConfig {
	queueName: string;
	options: {
		concurrency: number; // job processed simultaneously within single worker PROCESS
		lockDuration: number; // time in ms befor job lock expires
		autoRun?: boolean; // auto-start worker
		useWorkerThreads?: boolean; // use worker threads (instead of child_process)
	};
	minWorkers: number; // min no of workers at any time
	maxWorkers: number; // max no of workers pool will spawn
	concurrencyPerWorker: number; // num of concurrent job each WORKER can handle

	// scaling threshold
	scaleUpThreshold: number;
	scaleDownThreshold: number;

	minWaitCount: number | null; // min no of jobs in queue befor worker can start. if null -> condition ignored

	minWaitTime: number | null; // min time (in secs) that oldest job waits before worker starts. if null -> condition ignored

	// ❗️be careful brotha
	maxIdleWait: number | null; // times in secs after which worker -> terminated | if not null then this will take the worker count to zero even if you set minWorkerCount
}
