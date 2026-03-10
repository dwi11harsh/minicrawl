import dotenv from 'dotenv';
import path from 'path';
import z from 'zod';

dotenv.config({
	path: path.join(__dirname, '../../../../.env'),
});

const globalEnvSchema = z.object({
	ENV: z.enum(['dev', 'prod']),
	LOGGER_LEVEL: z.enum([
		'error',
		'warn',
		'info',
		'http',
		'verbose',
		'debug',
		'silly',
	]),
	REDIS_PORT: z.coerce.number(),
	REDIS_HOST: z.string(),
	REDIS_USERNAME: z.string(),
	REDIS_PASSWORD: z.string(),

	EACH_QUEUE_SIZE: z.coerce.number(),

	BULL_AUTH_KEY: z.string(),

	PORT: z.coerce.number(),
	HOST: z.string(),
});

export const globalEnv = globalEnvSchema.parse(process.env);

export const ScrapeRequestSchema = z.object({
	url: z.url({
		error: 'url: must be a valid URL (e.g. https://example.com)',
	}),
	includeScreenshot: z
		.boolean({ error: 'includeScreenshot: must be true or false' })
		.default(false),
	includeFullScreenshot: z
		.boolean({ error: 'includeFullScreenshot: must be true or false' })
		.default(false),
	includeContentInfo: z
		.boolean({ error: 'includeContentInfo: must be true or false' })
		.default(false),
	includeServerInfo: z
		.boolean({ error: 'includeServerInfo: must be true or false' })
		.default(false),
	engine: z
		.enum(['browser'], { error: "engine: must be one of 'browser'" })
		.default('browser'),
});

export type ScrapeRequestSchemaType = z.infer<typeof ScrapeRequestSchema>;

export const BatchScrapeRequestSchema = z.object({
	urls: z.array(
		z.url({
			error: 'urls[n]: each entry must be a valid URL (e.g. https://example.com)',
		}),
		{
			error: 'urls: must be an array of valid URLs',
		},
	),
	includeScreenshot: z
		.boolean({ error: 'includeScreenshot: must be true or false' })
		.default(false),
	includeFullScreenshot: z
		.boolean({ error: 'includeFullScreenshot: must be true or false' })
		.default(false),
	includeContentInfo: z
		.boolean({ error: 'includeContentInfo: must be true or false' })
		.default(false),
	includeServerInfo: z
		.boolean({ error: 'includeServerInfo: must be true or false' })
		.default(false),
	engine: z
		.enum(['browser'], { error: "engine: must be one of 'browser'" })
		.default('browser'),
});

export type BatchScrapeRequestSchemaType = z.infer<
	typeof BatchScrapeRequestSchema
>;

export const CrawlRequestSchema = z.object({
	url: z.url({
		error: 'url: must be a valid URL (e.g. https://example.com)',
	}),
	limit: z.coerce
		.number({ error: 'limit: must be a number between 1 and 200' })
		.nonnegative({ error: 'limit: must be a non-negative number' })
		.min(1, 'limit: must be at least 1')
		.max(200, 'limit: must be at most 200')
		.default(50),
	formats: z.array(
		z.enum(['markdown', 'json'], {
			error: "formats[n]: each entry must be one of 'markdown' or 'json'",
		}),
		{
			error: "formats: must be an array containing 'markdown' and/or 'json'",
		},
	),
	onlySameDomain: z
		.boolean({ error: 'onlySameDomain: must be true or false' })
		.default(true),
	onlySitemap: z
		.boolean({ error: 'onlySitemap: must be true or false' })
		.default(false),
	maxDepth: z
		.number({ error: 'maxDepth: must be a number between 1 and 10' })
		.nonnegative({ error: 'maxDepth: must be a non-negative number' })
		.min(1, 'maxDepth: must be at least 1')
		.max(
			10,
			'maxDepth: must be at most 10 — contact developers to increase limit',
		)
		.default(5),
	ignoreRobotsTxt: z
		.boolean({ error: 'ignoreRobotsTxt: must be true or false' })
		.default(false),
	allowExternalLinks: z
		.boolean({ error: 'allowExternalLinks: must be true or false' })
		.default(false),
	scraperOptions: z
		.object({
			engine: z.enum(['browser'], {
				error: "scraperOptions.engine: must be one of 'browser'",
			}),
			includeMarkdown: z.boolean({
				error: 'scraperOptions.includeMarkdown: must be true or false',
			}),
			includeMetadata: z.boolean({
				error: 'scraperOptions.includeMetadata: must be true or false',
			}),
			includeLinks: z.boolean({
				error: 'scraperOptions.includeLinks: must be true or false',
			}),
			includeImageLinks: z.boolean({
				error: 'scraperOptions.includeImageLinks: must be true or false',
			}),
			screenshot: z.boolean({
				error: 'scraperOptions.screenshot: must be true or false',
			}),
			fullScreenshot: z.boolean({
				error: 'scraperOptions.fullScreenshot: must be true or false',
			}),
			includeContentInfo: z.boolean({
				error: 'includeContentInfo: must be true or false',
			}),
			includeServerInfo: z.boolean({
				error: 'includeServerInfo: must be true or false',
			}),
		})
		.default({
			engine: 'browser',
			includeMarkdown: true,
			includeMetadata: true,
			includeLinks: true,
			includeImageLinks: true,
			screenshot: false,
			fullScreenshot: false,
			includeContentInfo: false,
			includeServerInfo: false,
		}),
});

export type CrawlRequestSchemaType = z.infer<typeof CrawlRequestSchema>;
