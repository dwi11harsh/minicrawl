/**
 * Custom Error class for when any environment variable is not found
 */

import logger from '@repo/logger';

export class EnvError extends Error {
	constructor(message: string, field?: string) {
		super(message);

		logger.error(`ENV VARIABLE: ${field} not found: `, message);
		this.name = 'Env Error';
		Object.setPrototypeOf(this, EnvError.prototype);
	}
}
