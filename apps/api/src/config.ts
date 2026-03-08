import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({
	path: path.join(__dirname, '../.env'),
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

console.log(process.env.HOST);
