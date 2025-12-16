import logger from '@repo/logger';

export class ScrapeError extends Error {
	constructor(
		message: string,
		options: {
			url: string;
		},
	) {
		super(message);
		this.name = 'Scrape Error';
		this.message = message;

		logger.error(`could not scrape ===${options.url}===: ${message}`);
	}
}
