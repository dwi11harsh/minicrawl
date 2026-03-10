import { logger } from '@repo/logger';
import { globalEnv } from '@repo/types/zod';
import { Queue, QueueOptions } from 'bullmq';
import { getRedisConnection } from '../index';

export const createBullMQ = (
	name: string,
	retry: number,
	queueJobOptions?: QueueOptions['defaultJobOptions'],
): Queue => {
	const defaultJobOptions: QueueOptions['defaultJobOptions'] = queueJobOptions
		? queueJobOptions
		: {
				attempts: retry,
				removeOnComplete: true,
				removeOnFail: false,
				sizeLimit: globalEnv.EACH_QUEUE_SIZE * 1024 * 1024,
				// priority: 0
			};
	logger.info('Creating BullMQ: ', name);
	return new Queue(name, {
		connection: getRedisConnection(),
		defaultJobOptions,
	});
};
