// link extractor for crawling
import * as cheerio from "cheerio";

export const extractLinks = (baseURL: string, html: string): string[] => {
  const $ = cheerio.load(html);
  const links: string[] = [];
  const seen = new Set<string>(); // for deduplication

  $("a[href]").each((index, element) => {
    const href = $(element).attr("href");

    // filter out empty hrefs
    if (!href || href.trim() === "") {
      return;
    }

    const trimmedHref = href.trim();

    // filter out fragment-only links (anchors)
    if (trimmedHref.startsWith("#")) {
      return;
    }

    // filter out mailto: and javascript: links
    if (
      trimmedHref.startsWith("mailto:") ||
      trimmedHref.startsWith("javascript:")
    ) {
      return;
    }

    let absoluteURL: string;

    try {
      // handle protocol-relative URLs (//example.com)
      if (trimmedHref.startsWith("//")) {
        const baseURLObj = new URL(baseURL);
        absoluteURL = new URL(baseURLObj.protocol + trimmedHref).href;
      }
      // link starts with http/https: keep it as is
      else if (
        trimmedHref.startsWith("http://") ||
        trimmedHref.startsWith("https://")
      ) {
        absoluteURL = trimmedHref;
      }
      // for relative URLs (including those starting with /): resolve with baseURL
      else {
        absoluteURL = new URL(trimmedHref, baseURL).href;
      }

      // Remove fragment identifier to avoid duplicates
      const urlObj = new URL(absoluteURL);
      urlObj.hash = "";
      const normalizedURL = urlObj.href;

      // Deduplicate within this extraction
      if (!seen.has(normalizedURL)) {
        seen.add(normalizedURL);
        links.push(normalizedURL);
      }
    } catch (e) {
      // invalid URL: skip it
    }
  });

  return links;
};
