import { htmlToMarkdown } from "@/lib/html-to-markdown";
import { updateJob } from "@/lib/job-store";
import logger from "@/lib/logger";
import { extractMetadata } from "@/lib/metadata";
import { Document } from "@/types";
import { Engine, scrapeWithEngine } from "./engines";
import { extractLinks } from "./lib/links";

export const scrapeURL = async (
  url: string,
  engine: Engine = "fetch"
): Promise<Document> => {
  const response = await scrapeWithEngine(url, engine);
  const markdown = htmlToMarkdown(response.html);
  const metadata = extractMetadata(response.html, response.url);

  return {
    url: response.url,
    html: response.html,
    markdown: markdown,
    metadata: metadata,
  };
};

export const crawlURL = async (
  startURL: string,
  limit: number,
  jobId: string,
  onlySameDomain: boolean = true
): Promise<void> => {
  try {
    let normalizedStartURL: string;

    try {
      const startURLObj = new URL(startURL);
      startURLObj.hash = "";

      normalizedStartURL = startURLObj.href;
    } catch {
      normalizedStartURL = startURL;
    }

    const visited = new Set<string>();
    const queue: string[] = [normalizedStartURL];
    const results: Document[] = [];
    const failedUrls: Array<{ url: string; error: string }> = [];

    let baseDomain: string;
    try {
      const startURLObj = new URL(normalizedStartURL);

      baseDomain = startURLObj.hostname;
    } catch {
      baseDomain = "";
    }

    logger.info(
      `Starting crawl for ${normalizedStartURL} with base domain: ${baseDomain}, limit: ${limit}`
    );

    while (queue.length != 0 && results.length < limit) {
      const url = queue.shift()!;

      if (visited.has(url)) {
        logger.info(`Skipping already visited: ${url}`);
        continue;
      }

      visited.add(url);
      logger.info(
        `Processing URL ${visited.size}/${queue.length + visited.size}: ${url}`
      );

      try {
        const document = await scrapeURL(url);

        results.push(document);
        logger.info(
          `Successfully scraped ${url}, total results: ${results.length}`
        );

        if (document.html) {
          const scrapedURLs: string[] = extractLinks(
            document.url,
            document.html
          );

          logger.info(
            `Extracted ${scrapedURLs.length} links from ${document.url}`
          );

          let addedCount = 0;
          for (const link of scrapedURLs) {
            try {
              const linkObj = new URL(link);
              const isSameDomain = linkObj.hostname === baseDomain;
              const isNotVisited = !visited.has(link);
              const isNotInQueue = !queue.includes(link);

              const shouldAdd = onlySameDomain
                ? linkObj.hostname === baseDomain &&
                  isNotVisited &&
                  isNotInQueue
                : isNotVisited && isNotInQueue;

              if (shouldAdd) {
                queue.push(link);
                addedCount++;
              } else {
                if (onlySameDomain && linkObj.hostname !== baseDomain) {
                  logger.info(
                    `Filtered out external link: ${link} (domain: ${linkObj.hostname})`
                  );
                }
              }
            } catch {
              // invalid URL, skip
            }
          }
          logger.info(
            `Added ${addedCount} new URLs to queue. Queue size: ${queue.length}`
          );
        }
      } catch (e) {
        logger.info(`Failed to scrape ${url}:`, e.message);
        failedUrls.push({
          url: url,
          error: e instanceof Error ? e.message : String(e),
        });
      }

      const crawlableTotal = queue.length + visited.size;
      updateJob(jobId, {
        completed: results.length,
        total: crawlableTotal,
        failedUrls,
      });
    }

    logger.info(
      `Crawl completed. Results: ${results.length}, Visited: ${visited.size}, Failed: ${failedUrls.length}`
    );

    updateJob(jobId, {
      status: "completed",
      results: results,
      failedUrls,
      completed: results.length,
      total: visited.size,
    });

    return;
  } catch (e) {
    updateJob(jobId, {
      status: "failed",
      error: e instanceof Error ? e.message : String(e),
    });
  }
};
