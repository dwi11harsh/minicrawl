import { Request, Response } from "express";
import { z } from "zod";
import { crawlRequestSchema } from "../../lib/validateURL";
import { crawlURL } from "../../scraper/scrapeURL";
import { Document } from "../../types";

export const crawlController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validateReqBody = crawlRequestSchema.parse(req.body);
    const url = validateReqBody.url;
    const limit = validateReqBody.limit;

    const crawlResponse: Document[] = await crawlURL(url, limit);

    res
      .json({
        data: crawlResponse,
        success: true,
      })
      .status(201);
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
