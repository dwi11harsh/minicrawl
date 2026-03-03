export interface ResponseHeaders {
	contentType?: string;
	contentEncoding?: string;
	dateScraped?: string;
	lastModified?: string;
	server?: string;
	age?: string;
	location?: string;
	referrer?: string;
	charSet?: string;
	serverAddr?: {
		IP?: string;
		PORT?: number;
	};
}

export interface Metadata {
	title?: string;
	description?: string;
	images?: string;
	language?: string;
	keywords?: string[];
}

export interface ScrapeFuncResponse {
	url: string;
	discoveredUrls?: string[];
	imageUrls?: string[];
	screenshot?: string;
	responseHeaders?: ResponseHeaders;
	metadata?: Metadata;
	rawHtml?: string;
}

export interface EngineResponse {
	url: string;
	success: boolean;
	status: number;
	statusText?: string;
	error?: string;
	data?: any;
}

export interface ScrapeEngineResponse extends EngineResponse {
	data?: ScrapeFuncResponse;
}

export interface BatchScrapeEngineResponse extends EngineResponse {
	data?: ScrapeFuncResponse[];
}
