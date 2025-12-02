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
    if (error instanceof z.ZodError) {
      logger.error("zod error occured at crawlController: ", error);

      const zodErrorResponse = {
        success: false,
        error: error.message,
      };
      res.status(400).json(zodErrorResponse);
      return;
    }

    logger.error("unknown error occured at crawlController: ", error);

    const unknownErrorResponse = {
      success: false,
      error: "Internal server error",
    };
    res.status(500).json(unknownErrorResponse);
    return;
  }
};
