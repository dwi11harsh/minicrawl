// URL validation
import { z } from "zod";

export const scrapeRequestSchema = z.object({
  url: z.string().min(1, "URL cannot be empty"),
});

export const crawlRequestSchema = z.object({
  url: z.string().min(1, "URL cannot be empty"),
  limit: z
    .number()
    .nonnegative()
    .min(1, "call scrape endpoint for this usecase")
    .max(10, "too high to crawl with depth more than 10"),
});
