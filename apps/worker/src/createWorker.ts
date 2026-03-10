import { Processor, Worker, WorkerOptions } from 'bullmq';

interface CreateWorkerOptions {
	queueName: string;
	asyncProcessor: Processor;
	options: WorkerOptions;
}
export const createWorker = ({
	queueName,
	asyncProcessor,
	options,
}: CreateWorkerOptions) => {
	const worker = new Worker(queueName, asyncProcessor, options);

	worker.on('ready', () => {
		process.send?.(`${queueName}'s worker is up and running`);
	});

	worker.on('closed', () => {
		process.send?.(`${queueName}'s worker has been closed`);
	});

	worker.on('error', err => {
		process.send?.(
			`${queueName}'s worker encountered an error: ${err.message}`,
		);
	});

	worker.on('failed', (job, err) => {
		process.send?.(
			`${queueName}'s job ${job?.id} failed with error: ${err.message}`,
		);
	});

	worker.on('completed', job => {
		process.send?.(`${queueName}'s job ${job.id} completed successfully`);
	});

	worker.on('paused', () => {
		process.send?.(`${queueName}'s worker has been paused`);
	});

	return worker;
};
