import { Request, Response } from "express";
import z from "zod";
import logger from "../../lib/logger";
import { scrapeRequestSchema } from "../../lib/validateURL";
import { scrapeURL } from "../../scraper/scrapeURL";
import { ScrapeResponse } from "../../types";

export const scrapeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("initiating scrape request");

    const validateURL = scrapeRequestSchema.parse(req.body);
    const url = validateURL.url;

    const document = await scrapeURL(url);

    const successResponse: ScrapeResponse = {
      success: true,
      data: {
        url: document.url,
        html: document.html,
        ...(document.markdown && { markdown: document.markdown }),
        ...(document.metadata && { metadata: document.metadata }),
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
