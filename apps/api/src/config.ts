import { z } from 'zod';

const configSchema = z.object({
	HOST: z.string().default('localhost'),
	PORT: z.coerce.number().default(3002),
});

export const config = configSchema.parse(process.env);
