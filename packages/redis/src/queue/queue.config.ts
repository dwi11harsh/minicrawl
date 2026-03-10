export const queueConfig = {
	scrapeDlqConf: {
		name: 'ScrapeDLQ',
		retry: 0,
		jobName: 'ScrapeDlqJob',
	},
	crawlQConf: {
		name: 'CrawlQueue',
		retry: 1,
		jobName: 'CrawlQJob',
	},
	batchScrapeQConf: {
		name: 'BatchScrapeQueue',
		retry: 1,
		jobName: 'BatchScrapeQJob',
	},
} as const;
