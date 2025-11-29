import { htmlToMarkdown } from "../../lib/html-to-markdown";
import { Document } from "../../types";
import { fetchPage } from "./lib/fetch";
import { extractLinks } from "./lib/links";

export const scrapeURL = async (url: string): Promise<Document> => {
  const response = await fetchPage(url);
  const markdown = htmlToMarkdown(response.html);

  return {
    url: response.url,
    html: response.html,
    markdown: markdown,
  };
};

export const crawlURL = async (
  startURL: string,
  limit: number
): Promise<Document[]> => {
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

  return results;
};
