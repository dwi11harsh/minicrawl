export class ValidationError extends Error {
	public readonly field?: string; // field that failed
	public readonly providedValue?: unknown;

	constructor(
		message: string,
		options?: {
			field?: string;
			providedValue?: unknown;
			cause?: Error;
		},
	) {
		super(message, { cause: options?.cause });

		Object.setPrototypeOf(this, new.target.prototype);
		this.name = this.constructor.name;

		this.field = options?.field;
		this.providedValue = options?.providedValue;
	}
}
