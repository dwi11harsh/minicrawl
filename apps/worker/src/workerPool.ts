import { logger } from '@repo/logger';
import { ChildProcess, fork } from 'child_process';
import path from 'path';

// add dotenv resolution

export interface WorkerPoolConfig {
	minWorkers: number;
	maxWorkers: number;
	queueName: string;
	concurrencyPerWorker: number;
}

export class WorkerPool {
	private workers: Map<number, ChildProcess> = new Map();
	private config: WorkerPoolConfig;
	private nextWorkerId = 0;

	constructor(config: WorkerPoolConfig) {
		this.config = config;
	}

	start = async () => {
		for (let i = 0; i < this.config.minWorkers; i++) {
			await this.addWorker();
		}

		logger.info(
			`${this.config.queueName} started ${this.config.minWorkers} workers`,
		);
	};

	addWorker = async (): Promise<number> => {
		// neccessary evil
		if (this.workers.size >= this.config.maxWorkers) {
			throw new Error(
				`[${this.config.queueName}] Maximum workers reached`,
			);
		}

		const workerId = this.nextWorkerId++;

		// path.resolve will point to compiled JS file
		const worker = fork(path.resolve(__dirname, 'worker-process.js'), [], {
			env: {
				...process.env,
				WORKER_ID: workerId.toString(),
				QUEUE_NAME: this.config.queueName,
				CONCURRENCY: this.config.concurrencyPerWorker.toString(),
			},
		});

		worker.on('exit', code => {
			logger.warn(
				`[${this.config.queueName}] Worker ${workerId} exited with code ${code}`,
			);
			this.workers.delete(workerId);

			if (code !== 0 && this.workers.size < this.config.minWorkers) {
				console.log(
					`[${this.config.queueName}] Restarting worker to maintain minimum`,
				);
				this.addWorker();
			}
		});

		worker.on('message', (message: any) => {
			logger.info(
				`[${this.config.queueName}] Worker ${workerId}:`,
				message,
			);
		});

		this.workers.set(workerId, worker);
		return workerId;
	};

	removeWorker = async (): Promise<boolean> => {
		if (this.workers.size <= this.config.minWorkers) {
			return false;
		}

		const entry = [...this.workers.entries()][this.workers.size - 1];

		if (!entry) return false;

		const [workerId, worker] = entry;

		worker.send({ type: 'shutdown' });

		return new Promise(resolve => {
			worker.on('exit', () => {
				this.workers.delete(workerId);
				resolve(true);
			});
			setTimeout(() => {
				if (this.workers.has(workerId)) {
					worker.kill('SIGKILL');
				}
			}, 30000);
		});
	};

	async scaleToSize(targetSize: number) {
		targetSize = Math.max(
			this.config.minWorkers,
			Math.min(targetSize, this.config.maxWorkers),
		);

		while (this.workers.size < targetSize) await this.addWorker();
		while (this.workers.size > targetSize) await this.removeWorker();
	}

	getWorkerCount(): number {
		return this.workers.size;
	}

	async shutdown() {
		console.log(`[${this.config.queueName}] Shutting down worker pool...`);
		const promises = [...this.workers.entries()].map(([id, worker]) => {
			return new Promise<void>(resolve => {
				worker.send({ type: 'shutdown' });
				worker.on('exit', () => resolve());
				setTimeout(() => {
					worker.kill('SIGKILL');
					resolve();
				}, 30000);
			});
		});
		await Promise.all(promises);
		console.log(`[${this.config.queueName}] Worker pool shut down`);
	}
}
