// URL validation
import { z } from "zod";
import { ValidationError } from "./error";

// URL validation function
export const validateURL = (url: string): void => {
  if (!url || typeof url !== "string" || url.trim().length === 0) {
    throw new ValidationError("URL cannot be empty", {
      field: "url",
      providedValue: url,
    });
  }

  // starts with http:// or https://
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new ValidationError("URL must start with http:// or https://", {
      field: "url",
      providedValue: url,
    });
  }

  //  valid domain format
  try {
    const urlObj = new URL(url);

    // has at least one dot and valid characters
    const hostname = urlObj.hostname;
    if (!hostname || hostname.length === 0) {
      throw new ValidationError("URL must contain a valid domain", {
        field: "url",
        providedValue: url,
      });
    }

    if (!hostname.includes(".") && !hostname.match(/^\[?[\da-fA-F:]+]?$/)) {
      throw new ValidationError("URL must contain a valid domain name", {
        field: "url",
        providedValue: url,
      });
    }
  } catch (err) {
    if (err instanceof ValidationError) {
      throw err;
    }
    throw new ValidationError("Invalid URL format", {
      field: "url",
      providedValue: url,
      cause: err instanceof Error ? err : undefined,
    });
  }
};

const urlSchema = z
  .string()
  .min(1, "URL cannot be empty")
  .refine(
    (url) => {
      try {
        validateURL(url);
        return true;
      } catch {
        return false;
      }
    },
    {
      message:
        "URL must start with http:// or https:// and contain a valid domain",
    }
  );

export const scrapeRequestSchema = z.object({
  url: urlSchema,
  formats: z.array(z.enum(["markdown", "html", "links"])).optional(),
  headers: z.record(z.string(), z.string()).optional(),
  timeout: z.number().optional(),
  engine: z.enum(["playwright", "fetch"]).optional(),
});

export const crawlRequestSchema = z.object({
  url: urlSchema,
  limit: z
    .number()
    .nonnegative()
    .min(1, "call scrape endpoint for this usecase")
    .max(50, "too high to crawl with depth more than 10"),
  formats: z.array(z.enum(["markdown", "html", "links"])).optional(),
  onlySameDomain: z.boolean().optional().default(false),
});
