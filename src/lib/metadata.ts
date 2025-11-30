import * as cheerio from "cheerio";
import { Metadata } from "../types";

export const extractMetadata = (html: string, baseUrl: string): Metadata => {
  const $ = cheerio.load(html);

  let title: string | undefined = undefined;
  let description: string | undefined = undefined;
  let language: string | undefined = undefined;
  const images: string[] = [];
  const keywords: string[] = [];

  // extract title
  const titleTag = $("title");
  if (titleTag.length > 0) {
    title = titleTag.text().trim();
  } else {
    const ogTitle = $('meta[property="og:title"]');
    if (ogTitle.length > 0) {
      title = ogTitle.attr("content")?.trim();
    }
  }

  // extract description
  const metaDescription = $('meta[name="description"]');
  if (metaDescription.length > 0) {
    description = metaDescription.attr("content")?.trim();
  } else {
    const ogDescription = $('meta[property="og:description"]');
    if (ogDescription.length > 0) {
      description = ogDescription.attr("content")?.trim();
    }
  }

  // extract language
  const htmlLang = $("html").attr("lang");
  if (htmlLang && typeof htmlLang === "string") {
    language = htmlLang.trim();
  }

  // extract images
  $("img[src]").each((index, element) => {
    const url = $(element).attr("src");

    // filter out empty srcs
    if (!url || url.trim() === "") {
      return;
    }

    const trimmedUrl = url.trim();

    // filter out fragment-only links (anchors)
    if (trimmedUrl.startsWith("#")) {
      return;
    }

    let absoluteURL: string;

    try {
      // handle protocol-relative URLs
      if (trimmedUrl.startsWith("//")) {
        const baseURLObj = new URL(baseUrl);
        absoluteURL = new URL(baseURLObj.protocol + trimmedUrl).href;
      } else if (
        trimmedUrl.startsWith("http://") ||
        trimmedUrl.startsWith("https://")
      ) {
        // link starts with http/https: keep it as is
        absoluteURL = trimmedUrl;
      } else {
        absoluteURL = new URL(trimmedUrl, baseUrl).href;
      }

      // remove fragment identifier to avoid duplicates
      const urlObj = new URL(absoluteURL);
      urlObj.hash = "";
      const normalizedURL = urlObj.href;

      // avoid duplicates within this extraction
      if (!images.includes(normalizedURL)) {
        images.push(normalizedURL);
      }
    } catch (e) {
      // invalid URL: skip
    }
  });

  // extract keywords
  const keywordsMeta = $('meta[name="keywords"]');
  if (keywordsMeta.length > 0) {
    const keywordsContent = keywordsMeta.attr("content");
    if (keywordsContent) {
      // split by comma and clean up each keyword
      keywords.push(
        ...keywordsContent
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0)
      );
    }
  }

  return {
    ...(title && { title }),
    ...(description && { description }),
    ...(images.length > 0 && { images }),
    ...(language && { language }),
    ...(keywords.length > 0 && { keywords }),
  };
};
