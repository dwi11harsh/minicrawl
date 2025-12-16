import z from 'zod';
import { validateURL } from './urlSchema.js';

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
	url: urlSchema,
});
