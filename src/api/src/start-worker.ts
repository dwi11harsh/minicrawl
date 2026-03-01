#!/usr/bin/env bun
import { config as dotenvConfig } from 'dotenv';
import { createWorker, type WorkerType } from '@mc/workers';
import { config } from './config';

dotenvConfig({ path: __dirname + '/.env' });

const remote_redis_uri = `redis://${config.REMOTE_REDIS_USERNAME}:${config.REMOTE_REDIS_PASSWORD}@${config.REMOTE_REDIS_HOST}:${config.REMOTE_REDIS_PORT}`;
const local_redis_uri = `redis://${config.REDIS_USERNAME}:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`;
const redis_uri = config.REDIS === 'local' ? local_redis_uri : remote_redis_uri;

const workerType = (process.env.WORKER_TYPE as WorkerType) || 'scrape';

console.log(`[PID ${process.pid}] Starting ${workerType} worker...`);

const worker = createWorker(workerType, redis_uri);

process.on('SIGTERM', async () => {
	console.log(`[PID ${process.pid}] Received SIGTERM, closing worker...`);
	await worker.close();
	process.exit(0);
});
