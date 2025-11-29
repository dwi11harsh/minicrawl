import { Request, Response } from "express";
import z from "zod";
import { scrapeURL } from "../../scraper/scrapeURL";
import { ScrapeResponse } from "../../types";

const scrapeRequestSchema = z.object({
  url: z.string().min(1, "URL cannot be empty"),
});

export const scrapeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validateURL = scrapeRequestSchema.parse(req.body);
    const url = validateURL.url;

    const document = await scrapeURL(url);

    const successResponse: ScrapeResponse = {
      success: true,
      data: document,
    };

    res.json(successResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodErrorResponse = {
        success: false,
        error: error.message,
      };
      res.status(400).json(zodErrorResponse);
      return;
    }

    const unknownErrorResponse: ScrapeResponse = {
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    };
    res.status(500).json(unknownErrorResponse);
  }
};
