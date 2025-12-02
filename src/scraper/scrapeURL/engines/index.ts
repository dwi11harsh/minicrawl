import logger from "../../../lib/logger";
import { fetchPage } from "../lib/fetch";
import { scrapeWithPlaywright } from "./playwright";

export type Engine = "fetch" | "playwright";

export const scrapeWithEngine = async (
  url: string,
  engine: Engine,
  options?: {
    timeout?: number;
  }
): Promise<{ html: string; url: string }> => {
  if (engine === "playwright") {
    return await scrapeWithPlaywright(url, options);
  }
  // try fetch first, fallback to Playwright on failure
  try {
    return await fetchPage(url, options);
  } catch (error) {
    logger.warn(`Fetch failed for ${url}, falling back to Playwright:`, error);
    return await scrapeWithPlaywright(url, options);
  }
};
