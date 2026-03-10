import { logger } from '@repo/logger';
import { Queue, QueueOptions } from 'bullmq';
import { getRedisConnection } from '../index';

export const createBullMQ = (
	name: string,
	queueJobOptions?: QueueOptions['defaultJobOptions'],
): Queue => {
	const defaultJobOptions: QueueOptions['defaultJobOptions'] = queueJobOptions
		? queueJobOptions
		: {
				attempts: 2,
				removeOnComplete: true,
				removeOnFail: false,
				sizeLimit: 1024 * 1024,
				// priority: 0
			};
	logger.info('Creating BullMQ: ', name);
	return new Queue(name, {
		connection: getRedisConnection(),
		defaultJobOptions,
	});
};
