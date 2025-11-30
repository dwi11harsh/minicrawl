export interface Document {
  url: string;
  html?: string;
  markdown?: string;
  links?: string[];
  metadata?: Metadata;
}

export interface ScrapeRequest {
  url: string;
}

export interface ScrapeResponse {
  success: boolean;
  data?: Document;
  error?: string;
}

export interface CrawlRequest {
  url: string;
  limit?: number; // TODO: default later (maybe to 3 or 5)
}

export interface CrawlResponse {
  success: boolean;
  data?: Document[];
  error?: string;
}

export interface Metadata {
  title?: string;
  description?: string;
  images?: string[];
  language?: string;
  keywords?: string[];
}
