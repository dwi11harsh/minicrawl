import { Request, Response } from "express";
import z from "zod";
import { htmlToMarkdown } from "../../lib/html-to-markdown";
import { scrapeRequestSchema } from "../../lib/validateURL";
import { fetchPage } from "../../scraper/scrapeURL/lib/fetch";
import { ScrapeResponse } from "../../types";

export const scrapeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validateURL = scrapeRequestSchema.parse(req.body);
    const url = validateURL.url;
    const fetchedResponse = await fetchPage(url);

    const markdown = htmlToMarkdown(fetchedResponse.html);
    const successResponse: ScrapeResponse = {
      success: true,
      data: {
        url: fetchedResponse.url,
        html: fetchedResponse.html,
        markdown: markdown,
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
