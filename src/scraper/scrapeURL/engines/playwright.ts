import { Browser, chromium, Page } from "playwright";
import logger from "../../../lib/logger";

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
      await browser.close().catch(() => {
        // ignore errors during browser close
      });
    }
    throw new Error(`Playwright scraping failed for ${url}: ${String(err)}`);
  }
};
