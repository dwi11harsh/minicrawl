import { Request, Response } from "express";
import z from "zod";
import logger from "../../lib/logger";
import { scrapeRequestSchema } from "../../lib/validateURL";
import { scrapeURL } from "../../scraper/scrapeURL";
import { extractLinks } from "../../scraper/scrapeURL/lib/links";
import { ScrapeResponse } from "../../types";

export const scrapeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("initiating scrape request");

    const validateURL = scrapeRequestSchema.parse(req.body);
    const url = validateURL.url;
    const formats = validateURL.formats ?? ["markdown"];

    const document = await scrapeURL(url);

    // response data based on requested formats
    const responseData: ScrapeResponse["data"] = {
      url: document.url,
    };

    // html if formats includes "html"
    if (formats.includes("html") && document.html) {
      responseData.html = document.html;
    }

    // markdown if formats includes "markdown"
    if (formats.includes("markdown") && document.markdown) {
      responseData.markdown = document.markdown;
    }

    // include links if formats includes "links"
    if (formats.includes("links") && document.html) {
      responseData.links = extractLinks(document.url, document.html);
    }

    const successResponse: ScrapeResponse = {
      success: true,
      data: responseData,
    };

    logger.info("initiating scrape response");

    res.json(successResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error("zod error occured at scrapeController: ", error);

      const zodErrorResponse = {
        success: false,
        error: error.message,
      };
      res.status(400).json(zodErrorResponse);
    }

    logger.error("unknown error occured at scrapeController: ", error);

    const unknownErrorResponse = {
      success: false,
      error: "Internal server error",
    };
    res.status(500).json(unknownErrorResponse);
  }
};
