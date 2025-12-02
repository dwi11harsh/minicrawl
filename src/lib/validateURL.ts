// URL validation
import { z } from "zod";

export const scrapeRequestSchema = z.object({
  url: z.string().min(1, "URL cannot be empty"),
  formats: z.array(z.enum(["markdown", "html", "links"])).optional(),
  headers: z.record(z.string(), z.string()).optional(),
  timeout: z.number().optional(),
});

export const crawlRequestSchema = z.object({
  url: z.string().min(1, "URL cannot be empty"),
  limit: z
    .number()
    .nonnegative()
    .min(1, "call scrape endpoint for this usecase")
    .max(10, "too high to crawl with depth more than 10"),
  formats: z.array(z.enum(["markdown", "html", "links"])).optional(),
});
