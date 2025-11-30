import { Request, Response } from "express";
import { z } from "zod";
import logger from "../../lib/logger";
import { crawlRequestSchema } from "../../lib/validateURL";
import { crawlURL } from "../../scraper/scrapeURL";
import { Document } from "../../types";

export const crawlController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("initiating crawl request");

    const validateReqBody = crawlRequestSchema.parse(req.body);

    const url = validateReqBody.url;
    const limit = validateReqBody.limit;

    const crawlResponse: Document[] = await crawlURL(url, limit);

    logger.info("initiating crawl response");

    res
      .json({
        data: crawlResponse,
        success: true,
      })
      .status(201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error("zod error occured at crawlController: ", error);

      const zodErrorResponse = {
        success: false,
        error: error.message,
      };
      res.status(400).json(zodErrorResponse);
    }

    logger.error("unknown error occured at crawlController: ", error);

    const unknownErrorResponse = {
      success: false,
      error: "Internal server error",
    };
    res.status(500).json(unknownErrorResponse);
  }
};
