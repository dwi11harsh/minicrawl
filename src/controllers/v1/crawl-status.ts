import { Request, Response } from "express";
import { validate as validateUUID } from "uuid";
import { getJob } from "../../lib/job-store";
import logger from "../../lib/logger";

export const crawlStatusController = async (req: Request, res: Response) => {
  const jobId = req.params.jobId;
  const validateId = validateUUID(jobId);
  const job = getJob(jobId);

  if (validateId && job) {
    if (job.status === "scraping") {
      res
        .json({
          success: true,
          status: job.status,
          completed: job.completed,
          total: job.total,
          failedUrls: job.failedUrls,
        })
        .status(202);
      return;
    }

    if (job.status === "completed") {
      res
        .json({
          success: true,
          status: job.status,
          completed: job.completed,
          total: job.total,
          data: job.results,
          failedUrls: job.failedUrls,
        })
        .status(202);
      return;
    }

    if (job.status === "failed") {
      res
        .json({
          success: true,
          status: job.status,
          completed: job.completed,
          total: job.total,
          error: job.error,
        })
        .status(202);
      return;
    }
  } else {
    logger.info("job not found: ", jobId);
    res
      .json({
        success: false,
        message: "job not found",
      })
      .status(404);
    return;
  }
};
