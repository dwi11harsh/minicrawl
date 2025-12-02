export class ScrapeError extends Error {
  public readonly url?: string; // url that was being scraped when error occurred
  public readonly statusCode?: number;
  public readonly retryable?: boolean; // weather error is retryable

  constructor(
    message: string,
    options?: {
      url?: string;
      statusCode?: number;
      retryable?: boolean;
      cause?: Error;
    }
  ) {
    // send message to parent Error class
    super(message, { cause: options?.cause });
    // required for TypeScript
    Object.setPrototypeOf(this, new.target.prototype);

    // contextual info
    this.name = this.constructor.name;
    this.url = options?.url;
    this.statusCode = options?.statusCode;
    this.retryable = options?.retryable;
  }
}

export class TimeoutError extends ScrapeError {
  public readonly timeoutMs: number;

  constructor(
    message: string,
    options?: {
      url?: string;
      timeoutMs?: number;
      cause?: Error;
    }
  ) {
    super(message, {
      url: options?.url,
      retryable: true,
      cause: options?.cause,
    });

    this.timeoutMs = options?.timeoutMs ?? 30000;
  }
}

export class ValidationError extends Error {
  public readonly field?: string; // field that failed
  public readonly providedValue?: unknown;

  constructor(
    message: string,
    options?: {
      field?: string;
      providedValue?: unknown;
      cause?: Error;
    }
  ) {
    super(message, { cause: options?.cause });

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = this.constructor.name;

    this.field = options?.field;
    this.providedValue = options?.providedValue;
  }
}
