import createLogger from '@mc/logger';
import { Queue, type QueueOptions } from 'bullmq';
import { getRedisConnection } from 'src/lib/getRedisConnection';

// TODO: decide priority & sizeLimit later

const logger = createLogger('@mc/redis/lib/getBullMq:');

export const getBullMQ = (
	queueName: string,
	redisUrl: string,
	defaultQueueJobOptions?: QueueOptions['defaultJobOptions'],
): Queue => {
	const defaultJobOptions = defaultQueueJobOptions
		? defaultQueueJobOptions
		: {
				attempts: 1,
				// priority: 0,
				removeOnComplete: true,
				removeOnFail: true,
				// sizeLimit: 1024 * 1024,
			};

	logger.info(`[CREATING] ${queueName}`);
	return new Queue(queueName, {
		connection: getRedisConnection(redisUrl),
		defaultJobOptions,
	});
};
