import dotenv from 'dotenv';
import path from 'path';
import z from 'zod';

dotenv.config({
	path: path.join(__dirname, '../../../../.env'),
});

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
});

export const globalEnv = globalEnvSchema.parse(process.env);
