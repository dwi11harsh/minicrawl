import { Request, Response } from "express";
import { getJob } from "../../lib/job-store";

export const crawlStatusController = async (req: Request, res: Response) => {
  const jobId = req.params.jobId;
  const job = getJob(jobId);
  if (job) {
    const data = job.results;
    res.json({
      success: true,
      status: job.status,
      completed: 2,
      total: 5,
      data: data ? data : undefined,
    });
  }
};
