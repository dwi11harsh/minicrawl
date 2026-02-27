import createLogger from '@mc/logger';
import IORedis from 'ioredis';

let redisConnection: IORedis;
const logger = createLogger('@mc/redis/lib/getRedisConnection:');

export const getRedisConnection = (redisUrl: string): IORedis => {
	if (!redisConnection) {
		redisConnection = new IORedis(redisUrl!, {
			maxRetriesPerRequest: null,
		});

		redisConnection.on('connect', () =>
			logger.info(`[REDIS CONNECTION SUCCESSFULLY MADE]`),
		);
		redisConnection.on('connecting', () =>
			logger.info(`[CONNECTING TO REDIS...]`),
		);
		redisConnection.on('reconnecting', () =>
			logger.warn(`[REDIS RECONNECTING]`),
		);
		redisConnection.on('error', error =>
			logger.error(`[REDIS ERROR]: `, { error }),
		);
		redisConnection.on('close', () =>
			logger.info(`[REDIS CONNECTION CLOSED]`),
		);
	}

	return redisConnection;
};
