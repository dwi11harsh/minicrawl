import { Document } from "../../types";
import { fetchPage } from "../lib/fetch";

export const scrapeURL = async (url: string): Promise<Document> => {
  const response = await fetchPage(url);

  return {
    url: response.url,
    html: response.html,
    markdown: "",
  };
};
