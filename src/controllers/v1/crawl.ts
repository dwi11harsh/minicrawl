import { Request, Response } from "express";
import { z } from "zod";
import { ScrapeError, TimeoutError, ValidationError } from "../../lib/error";
import { createJob } from "../../lib/job-store";
import logger from "../../lib/logger";
import { crawlRequestSchema } from "../../lib/validateURL";
import { crawlURL } from "../../scraper/scrapeURL";

export const crawlController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("initiating crawl request");

    const validateReqBody = crawlRequestSchema.parse(req.body);

    const url = validateReqBody.url;
    const limit = validateReqBody.limit;
    const formats = validateReqBody.formats ?? ["markdown"];
    const onlySameDomain = validateReqBody.onlySameDomain;

    const newJobId = createJob(url, limit, formats);

    logger.info("sending immediate crawl id");
    res.status(201).json({
      id: newJobId,
      success: true,
    });

    logger.info("starting crawl process with id: ", newJobId);
    setImmediate(async () => {
      try {
        await crawlURL(url, limit, newJobId, onlySameDomain);
      } catch (e) {
        logger.error("background crawl error: ", e);
      }
    });

    return;
  } catch (error) {
    // Validation
    if (error instanceof ValidationError) {
      logger.error("validation error at crawlController: ", error);
      res.status(400).json({
        success: false,
        error: error.message,
        code: "VALIDATION_ERROR",
        field: error.field,
      });
      return;
    }

    // Zod
    if (error instanceof z.ZodError) {
      logger.error("zod error at crawlController: ", error);
      res.status(400).json({
        success: false,
        error: error.message || "Validation failed",
        code: "VALIDATION_ERROR",
      });
      return;
    }

    // Timeout
    if (error instanceof TimeoutError) {
      logger.error("timeout error at crawlController: ", error);
      res.status(408).json({
        success: false,
        error: error.message,
        code: "TIMEOUT",
        url: error.url,
      });
      return;
    }

    // Scrape
    if (error instanceof ScrapeError) {
      logger.error("scrape error at crawlController: ", error);
      const statusCode = error.statusCode ?? 500;
      res.status(statusCode).json({
        success: false,
        error: error.message,
        code: "SCRAPE_ERROR",
        url: error.url,
      });
      return;
    }

    // Unknown
    logger.error("unknown error at crawlController: ", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    });
    return;
  }
};
