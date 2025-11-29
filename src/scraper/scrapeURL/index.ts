import { htmlToMarkdown } from "../../lib/html-to-markdown";
import { Document } from "../../types";
import { fetchPage } from "./lib/fetch";

export const scrapeURL = async (url: string): Promise<Document> => {
  const response = await fetchPage(url);
  const markdown = htmlToMarkdown(response.html);

  return {
    url: response.url,
    html: response.html,
    markdown: markdown,
  };
};
