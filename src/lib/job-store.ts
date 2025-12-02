import { v4 as uuidv4 } from "uuid";
import { Document } from "../types";

interface JobType {
  id: string;
  status: "scraping" | "completed" | "failed";
  url: string;
  limit: number;
  completed?: number;
  total?: number;
  results?: Document[];
  error?: string;
  createdAt: Date;
}

const jobs = new Map<string, JobType>();

export const createJob = (url: string, limit: number): string => {
  const jobId = uuidv4();

  const newJob: JobType = {
    id: jobId,
    status: "scraping",
    url,
    limit,
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
