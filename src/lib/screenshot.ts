import { Browser, chromium } from "playwright";
import { ScrapeError } from "./error";
import logger from "./logger";

export const takeScreenshot = async (
  url: string,
  options?: {
    fullPage?: boolean;
  }
): Promise<string> => {
  let browser: Browser;
  try {
    browser = await chromium.launch();

    const page = await browser.newPage();

    await page.goto(url);

    const imageBuffer = await page.screenshot({ fullPage: options?.fullPage });

    await browser.close();

    return imageBuffer.toString();
  } catch (err) {
    logger.error(`could not take SS of ${url} with error: ${err.message}`);
    throw new ScrapeError("could not take SS", {
      url,
      retryable: false,
      cause: err.message,
    });
  }
};
