import { ValidationError } from '@repo/error';
import z from 'zod';

export const scrapeRequestSchema = z.object({
	url: z.url(),
	engine: z.enum(['fetch', 'playwright']).default('fetch'),
});

export const ValidateScrapeRequestSchema = (request: any) => {
	try {
		const parseResult = scrapeRequestSchema.safeParse(request);
		if (parseResult.success) {
			return parseResult.data;
		} else {
			throw new ValidationError('Invalid URL format', {
				field: 'url',
				providedValue: request,
				cause: parseResult.error,
			});
		}
	} catch (err) {
		if (err instanceof ValidationError) {
			throw err;
		}
		throw new ValidationError('Invalid URL format', {
			field: 'url',
			providedValue: request,
			cause: err instanceof Error ? err : undefined,
		});
	}
};

export type ScrapeRequestSchemaType = z.infer<typeof scrapeRequestSchema>;
