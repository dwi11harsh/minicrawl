import { htmlToMarkdown } from "../../lib/html-to-markdown";
import { updateJob } from "../../lib/job-store";
import logger from "../../lib/logger";
import { extractMetadata } from "../../lib/metadata";
import { Document } from "../../types";
import { fetchPage } from "./lib/fetch";
import { extractLinks } from "./lib/links";

export const scrapeURL = async (url: string): Promise<Document> => {
  const response = await fetchPage(url);
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
  jobId: string
): Promise<void> => {
  try {
    const visited = new Set<string>();
    const queue: string[] = [startURL];
    const results: Document[] = [];
    const failedUrls: Array<{ url: string; error: string }> = [];

    // extract base domain for filtering
    let baseDomain: string;
    try {
      const startURLObj = new URL(startURL);
      baseDomain = startURLObj.hostname;
    } catch {
      baseDomain = "";
    }

    while (queue.length != 0 && results.length < limit) {
      const url = queue.shift()!;

      // check if already visited
      if (visited.has(url)) {
        continue;
      }

      // mark as visited
      visited.add(url);

      try {
        // scrape it
        const document = await scrapeURL(url);

        results.push(document);

        // add new links to queue before updating job status
        if (document.html) {
          const scrapedURLs: string[] = extractLinks(url, document.html);
          for (const link of scrapedURLs) {
            // filter to same domain only
            try {
              const linkObj = new URL(link);
              if (
                linkObj.hostname === baseDomain &&
                !visited.has(link) &&
                !queue.includes(link)
              ) {
                queue.push(link);
              }
            } catch {
              // invalid URL, skip
            }
          }
        }
      } catch (e) {
        logger.info(`Failed to scrape ${url}:`, e.message);
        failedUrls.push({
          url: url,
          error: e instanceof Error ? e.message : String(e),
        });
      }

      // update the job to show accurate number of results
      // only count URLs that are actually crawlable (same domain)
      const crawlableTotal = queue.length + visited.size;
      updateJob(jobId, {
        completed: results.length,
        total: crawlableTotal,
        failedUrls,
      });
    }

    // update the job with all the results
    updateJob(jobId, {
      status: "completed",
      results: results,
      failedUrls,
      completed: results.length,
      total: visited.size,
    });

    return;
  } catch (e) {
    // update the job to show the error that occurred
    updateJob(jobId, {
      status: "failed",
      error: e instanceof Error ? e.message : String(e),
    });
  }
};
