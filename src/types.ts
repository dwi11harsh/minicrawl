export interface Document {
  url: string;
  html?: string;
  markdown?: string;
  links?: string[];
}

export interface ScrapeRequest {
  url: string;
}

export interface ScrapeResponse {
  success: boolean;
  data?: Document;
  error?: string;
}
