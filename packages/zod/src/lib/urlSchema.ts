import { ValidationError } from '@repo/error';

export const validateURL = (url: string): void => {
	if (!url || typeof url !== 'string' || url.trim().length === 0) {
		throw new ValidationError('URL cannot be empty', {
			field: 'url',
			providedValue: url,
		});
	}

	// starts with http:// or https://
	if (!url.startsWith('http://') && !url.startsWith('https://')) {
		throw new ValidationError('URL must start with http:// or https://', {
			field: 'url',
			providedValue: url,
		});
	}

	//  valid domain format
	try {
		const urlObj = new URL(url);

		// has at least one dot and valid characters
		const hostname = urlObj.hostname;
		if (!hostname || hostname.length === 0) {
			throw new ValidationError('URL must contain a valid domain', {
				field: 'url',
				providedValue: url,
			});
		}

		if (!hostname.includes('.') && !hostname.match(/^\[?[\da-fA-F:]+]?$/)) {
			throw new ValidationError('URL must contain a valid domain name', {
				field: 'url',
				providedValue: url,
			});
		}
	} catch (err) {
		if (err instanceof ValidationError) {
			throw err;
		}
		throw new ValidationError('Invalid URL format', {
			field: 'url',
			providedValue: url,
			cause: err instanceof Error ? err : undefined,
		});
	}
};
