// link extractor for crawling
import * as cheerio from "cheerio";

export const extractLinks = (baseURL: string, html: string): string[] => {
  const $ = cheerio.load(html);

  const links: string[] = [];

  $("a[href]").each((index, element) => {
    const href = $(element).attr("href");

    // filter out empty hrefs
    if (!href || href.trim() === "") {
      return;
    }

    // filter out mailto: and javascript: links
    const trimmedHref = href.trim();
    if (
      trimmedHref.startsWith("mailto:") ||
      trimmedHref.startsWith("javascript:")
    ) {
      return;
    }

    // link starts with http/https: keep it as is
    if (
      trimmedHref.startsWith("http://") ||
      trimmedHref.startsWith("https://")
    ) {
      links.push(trimmedHref);
      return;
    }

    // link starts with /: join with baseUrl
    if (trimmedHref.startsWith("/")) {
      try {
        const absoluteURL = new URL(trimmedHref, baseURL).href;
        links.push(absoluteURL);
      } catch (e) {
        // invalid URL: skip
      }
      return;
    }

    // for relative URLs: try to resolve with baseURL
    try {
      const absoluteURL = new URL(trimmedHref, baseURL).href;
      links.push(absoluteURL);
    } catch (e) {
      // invalid URL: skip it
    }
  });

  return links;
};
