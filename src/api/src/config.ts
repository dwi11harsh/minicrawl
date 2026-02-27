import { z } from 'zod';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({
	path: join(dirname(fileURLToPath(import.meta.url)), '../.env'),
});

const configSchema = z.object({
	HOST: z.string().default('localhost'),
	PORT: z.coerce.number().default(3002),

	// redis
	REMOTE_REDIS_USERNAME: z.string(),
	REMOTE_REDIS_PASSWORD: z.string(),
	REMOTE_REDIS_HOST: z.string(),
	REMOTE_REDIS_PORT: z.coerce.number(),
	REMOTE_REDIS_PUBLIC_ENDPOINT: z.string(),

	BULL_AUTH_KEY: z.string(),
});

export const config = configSchema.parse(process.env);
