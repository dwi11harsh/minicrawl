import { v4 as uuidv4 } from "uuid";
import { Document } from "../types";

interface JobType {
  id: string;
  status: "scraping" | "completed" | "failed";
  url: string;
  limit: number;
  formats?: string[];
  completed?: number;
  total?: number;
  results?: Document[];
  error?: string;
  createdAt: Date;
  failedUrls?: Array<{ url: string; error: string }>;
}

const jobs = new Map<string, JobType>();

export const createJob = (
  url: string,
  limit: number,
  formats?: string[]
): string => {
  const jobId = uuidv4();

  const newJob: JobType = {
    id: jobId,
    status: "scraping",
    url,
    limit,
    formats,
    createdAt: new Date(),
  };

  jobs.set(jobId, newJob);

  return jobId;
};

export const getJob = (id: string): JobType | undefined => {
  return jobs.get(id);
};

export const updateJob = (id: string, updates: Partial<JobType>) => {
  const existingJob = jobs.get(id);
  if (existingJob) {
    jobs.set(id, { ...existingJob, ...updates });
  }
};
