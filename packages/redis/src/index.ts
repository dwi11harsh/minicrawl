import { logger } from '@repo/logger';
import { globalEnv } from '@repo/types/zod';
import IORedis from 'ioredis';

let redisConnection: IORedis;

export const getRedisConnection = (): IORedis => {
	if (!redisConnection) {
		const redisUrl = `redis://${globalEnv.REDIS_USERNAME}:${globalEnv.REDIS_PASSWORD}@${globalEnv.REDIS_HOST}:${globalEnv.REDIS_PORT}`;

		redisConnection = new IORedis(redisUrl, {
			maxRetriesPerRequest: null, // needed for BullMQ
		});

		redisConnection.on('connect', () =>
			logger.info(`redis connected successfully`),
		);
		redisConnection.on('connecting', () =>
			logger.info(`connecting to redis...`),
		);
		redisConnection.on('reconnecting', () =>
			logger.warn(`⚠️redis reconnecting...`),
		);
		redisConnection.on('error', error =>
			logger.error(`❗️redis error: `, { error }),
		);
		redisConnection.on('close', () =>
			logger.info(
				`*`.repeat(10),
				'redis connection closed',
				`*`.repeat(10),
			),
		);
	}

	return redisConnection;
};
