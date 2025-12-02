import { htmlToMarkdown } from "../../lib/html-to-markdown";
import { updateJob } from "../../lib/job-store";
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

    while (queue.length != 0 && results.length < limit) {
      const url = queue.shift()!;

      // check if already visited
      if (visited.has(url)) {
        continue;
      }

      // mark as visited
      visited.add(url);

      // scrape it
      const document = await scrapeURL(url);

      // update the job to show accurate results
      updateJob(jobId, {
        completed: results.length,
        total: queue.length + results.length,
      });

      results.push(document);

      if (document.html) {
        const scrapedURLs: string[] = extractLinks(url, document.html);
        for (const link of scrapedURLs) {
          if (!visited.has(link) && !queue.includes(link)) {
            queue.push(link);
          }
        }
      }
    }

    // update the job with all the results
    updateJob(jobId, {
      status: "completed",
      results: results,
    });

    return;
  } catch (e) {
    // update the job to show the error that occured
    updateJob(jobId, {
      status: "failed",
      error: e.message,
    });
  }
};
