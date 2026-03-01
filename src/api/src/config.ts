import { z } from 'zod';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({
	path: join(dirname(fileURLToPath(import.meta.url)), '../.env'),
});

const configSchema = z.object({
	ENV: z.enum(['development', 'production']),

	REDIS: z.enum(['local', 'remote']),

	HOST: z.string().default('localhost'),
	PORT: z.coerce.number().default(3002),

	// remote redis
	REMOTE_REDIS_USERNAME: z.string(),
	REMOTE_REDIS_PASSWORD: z.string(),
	REMOTE_REDIS_HOST: z.string(),
	REMOTE_REDIS_PORT: z.coerce.number(),
	REMOTE_REDIS_PUBLIC_ENDPOINT: z.string(),

	// redis
	REDIS_PORT: z.coerce.number(),
	REDIS_HOST: z.string(),
	REDIS_USERNAME: z.string(),
	REDIS_PASSWORD: z.string(),

	BULL_AUTH_KEY: z.string(),
});

export const config = configSchema.parse(process.env);
