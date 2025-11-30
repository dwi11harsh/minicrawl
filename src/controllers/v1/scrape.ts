import { Request, Response } from "express";
import z from "zod";
import { htmlToMarkdown } from "../../lib/html-to-markdown";
import logger from "../../lib/logger";
import { extractMetadata } from "../../lib/metadata";
import { scrapeRequestSchema } from "../../lib/validateURL";
import { fetchPage } from "../../scraper/scrapeURL/lib/fetch";
import { ScrapeResponse } from "../../types";

export const scrapeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("initiating scrape request");

    const validateURL = scrapeRequestSchema.parse(req.body);
    const url = validateURL.url;

    const fetchedResponse = await fetchPage(url);

    const metadata = extractMetadata(fetchedResponse.html, fetchedResponse.url);

    const markdown = htmlToMarkdown(fetchedResponse.html);

    const successResponse: ScrapeResponse = {
      success: true,
      data: {
        url: fetchedResponse.url,
        html: fetchedResponse.html,
        ...(markdown && { markdown }),
        ...(metadata && { metadata }),
      },
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
