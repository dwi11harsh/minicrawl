export interface MiniResponse {
	success: boolean;
	error?: string;
	data?: any;
}

export interface ScrapeEngineOptions {
	url: string;
	includeScreenshot: boolean;
	includeFullScreenshot: boolean;
	includeContentInfo: boolean;
	includeServerInfo: boolean;
}

export interface ContentInfo {
	contentType?: string;
	contentEncoding?: string;
	lastModified?: string;
	charSet?: string;
	age?: string;
}

export interface ServerInfo {
	server?: string;
	ip?: string;
	port?: string;
}

export interface ScrapeEngineResponse extends MiniResponse {
	url: string;
	scrapedAt?: Date;
	data?: {
		html?: string;
		screenshot?: string;
		contentInfo?: ContentInfo;
		serverInfo?: ServerInfo;
	};
}
