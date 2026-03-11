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

export interface AutoScalerConfig {
	maxTotalWorkers: number; // max total workers across all queues
	checkIntervalMs: number; // how often to check queue depths for scaling conditions

	cooldownMs: number; // min time to wait for scaling (add/remove)
}

export interface WorkerProcessInfo {
	process: import('child_process').ChildProcess;
	workerId: number;
	idleSince: number | null;
	idleTimer?: NodeJS.Timeout;
	activeJobs: number; // 0 = idle
}

// ⚠️ Generated using some model from VS Code
export type WorkerMessage =
	| { type: 'ready'; workerId: number; queueName: string }
	| { type: 'busy'; workerId: number } // Worker started a job
	| { type: 'idle'; workerId: number } // Worker completed all jobs
	| { type: 'error'; workerId: number; error: string }
	| { type: 'completed'; workerId: number; jobId: string }
	| { type: 'failed'; workerId: number; jobId: string; error: string }
	| { type: 'paused'; workerId: number }
	| { type: 'closed'; workerId: number };

// ⚠️ this one too
export type ParentMessage =
	| { type: 'shutdown' } // Gracefully stop processing and exit
	| { type: 'ping' } // Optional health check
	| { type: 'updateConfig'; config: Partial<QueueWorkerConfig> };

// ⚠️ promise this is last one
export interface QueueStats {
	waiting: number; // Jobs waiting to be processed
	active: number; // Jobs currently being processed
	delayed: number; // Jobs scheduled for later
	completed: number; // Jobs completed (since last reset)
	failed: number; // Jobs failed
	/** Total waiting + delayed (backlog) */
	depth: number;
	/** Time in seconds the oldest waiting job has been waiting (approx) */
	oldestWaitingTime?: number;
}
