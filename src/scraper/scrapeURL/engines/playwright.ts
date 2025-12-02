import { ScrapeError, TimeoutError } from "@/lib/error";
import logger from "@/lib/logger";
import { Browser, chromium, Page } from "playwright";

export const scrapeWithPlaywright = async (
  url: string,
  options?: {
    timeout?: number;
  }
): Promise<{ html: string; url: string }> => {
  let browser: Browser | null = null;
  try {
    logger.info("starting chromium browser");
    browser = await chromium.launch();

    logger.info("starting new page in browser");
    const page: Page = await browser.newPage();

    logger.info(`navigating to ${url} in browser`);
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: options?.timeout ?? 30000,
    });

    // extract status code and html from response
    const html = await page.content();

    logger.info("closing the chromium browser");
    await browser.close();

    return { html, url };
  } catch (err) {
    if (browser) {
      await browser.close().catch(() => {});
    }

    const timeout = options?.timeout ?? 30000;
    const error = err instanceof Error ? err : new Error(String(err));

    if (error.name === "TimeoutError") {
      throw new TimeoutError(`Page load exceeded ${timeout}ms`, {
        url,
        timeoutMs: timeout,
        cause: error,
      });
    }

    throw new ScrapeError(`Playwright scraping failed for ${url}`, {
      url,
      retryable: true,
      cause: error,
    });
  }
};
