export interface MiniResponse {
	success: boolean;
	error?: string;
	data?: any;
}

export type EngineType = 'browser';

export interface ScrapeEngineOptions {
	url: string;
	includeScreenshot: boolean;
	includeFullScreenshot: boolean;
	includeContentInfo: boolean;
	includeServerInfo: boolean;
	browserHeadless?: boolean;
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
	url?: string;
	status: number;
	scrapedAt?: Date;
	data?: {
		html?: string;
		screenshot?: string;
		contentInfo?: ContentInfo;
		serverInfo?: ServerInfo;
	};
}

export interface CleanHtmlOptions {
	baseUrl: string;
	/**
	 * if keepOnlyTags is given an array of tags then removeTags and rest of tags won't be considered and all other tags will be removed
	 */
	keepOnlyTags: string[];
	/**
	 * keepTags will be removed from the list of tags which are about to be removed for sanitization
	 */
	keepTags: string[];
	removeTags: string[];
	extractMetadata: boolean;
	extractImages: boolean;
	extractLinks: boolean;
}
