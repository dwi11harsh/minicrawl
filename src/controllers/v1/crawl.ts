import { Request, Response } from "express";
import { z } from "zod";
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

    const newJobId = createJob(url, limit);

    logger.info("sending immediate crawl id");
    res
      .json({
        id: newJobId,
        success: true,
      })
      .status(201);

    logger.info("starting crawl process with id: ", newJobId);
    setImmediate(async () => {
      try {
        await crawlURL(url, limit, newJobId);
      } catch (e) {
        logger.error("background crawl error: ", e);
      }
    });
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
