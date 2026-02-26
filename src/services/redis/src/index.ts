import createLogger from '@mc/logger';
import IORedis from 'ioredis';

let redisConnection: IORedis;
const logger = createLogger('@mc/redis:');
const filename: string = '@mc/redis:';
export const getRedisConnection = (redisUrl: string): IORedis => {
	if (!redisConnection) {
		redisConnection = new IORedis(redisUrl!, {
			maxRetriesPerRequest: null,
		});

		redisConnection.on('connect', () =>
			logger.info(`${filename}[REDIS CONNECTION SUCCESSFULLY MADE]`),
		);
		redisConnection.on('connecting', () =>
			logger.info(`${filename}[CONNECTING TO REDIS...]`),
		);
		redisConnection.on('reconnecting', () =>
			logger.warn(`${filename}[REDIS RECONNECTING]`),
		);
		redisConnection.on('error', error =>
			logger.error(`${filename}[REDIS ERROR]: `, { error }),
		);
		redisConnection.on('close', () =>
			logger.info(`${filename}[REDIS CONNECTION CLOSED]`),
		);
	}

	return redisConnection;
};
