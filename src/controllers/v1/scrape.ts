import { Request, Response } from "express";
import z from "zod";
import { fetchPage } from "../../scraper/lib/fetch";
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
    const fetchedResponse = await fetchPage(url);

    const successResponse: ScrapeResponse = {
      success: true,
      data: {
        url: fetchedResponse.url,
        html: fetchedResponse.html,
        markdown: `fake content from ${url}`,
      },
    };

    res.json(successResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodErrorResponse = {
        success: false,
        error: error.message,
      };
      res.status(400).json(zodErrorResponse);
    }

    const unknownErrorResponse = {
      success: false,
      error: "Internal server error",
    };
    res.status(500).json(unknownErrorResponse);
  }
};
