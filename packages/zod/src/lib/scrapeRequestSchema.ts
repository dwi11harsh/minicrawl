import { ValidationError } from '@repo/error';
import z from 'zod';
import { validateURL } from './urlSchema';

const urlSchema = z
	.string()
	.min(1, 'URL cannot be empty')
	.refine(
		url => {
			try {
				validateURL(url);
				return true;
			} catch {
				return false;
			}
		},
		{
			message:
				'URL must start with http:// or https:// and contain a valid domain',
		},
	);

export const scrapeRequestSchema = z.object({
	url: z.url(),
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
