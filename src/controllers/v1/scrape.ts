import { ScrapeError, TimeoutError, ValidationError } from "@/lib/error";
import logger from "@/lib/logger";
import { scrapeRequestSchema } from "@/lib/validateURL";
import { scrapeURL } from "@/scraper/scrapeURL";
import { extractLinks } from "@/scraper/scrapeURL/lib/links";
import { ScrapeResponse } from "@/types";
import { Request, Response } from "express";
import z from "zod";

export const scrapeController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("initiating scrape request");

    const validateURL = scrapeRequestSchema.parse(req.body);
    const url = validateURL.url;
    const formats = validateURL.formats ?? ["markdown"];

    const document = await scrapeURL(url, validateURL.engine);

    // response data based on requested formats
    const responseData: ScrapeResponse["data"] = {
      url: document.url,
    };

    // html if formats includes "html"
    if (formats.includes("html") && document.html) {
      responseData.html = document.html;
    }

    // markdown if formats includes "markdown"
    if (formats.includes("markdown") && document.markdown) {
      responseData.markdown = document.markdown;
    }

    // include links if formats includes "links"
    if (formats.includes("links") && document.html) {
      responseData.links = extractLinks(document.url, document.html);
    }

    const successResponse: ScrapeResponse = {
      success: true,
      data: responseData,
    };

    logger.info("initiating scrape response");

    res.json(successResponse);
  } catch (error) {
    if (error instanceof ValidationError) {
      logger.error("validation error at scrapeController: ", error);
      res.status(400).json({
        success: false,
        error: error.message,
        code: "VALIDATION_ERROR",
        field: error.field,
      });
      return;
    }

    // Zod
    if (error instanceof z.ZodError) {
      logger.error("zod error at scrapeController: ", error);
      res.status(400).json({
        success: false,
        error: error.message || "Validation failed",
        code: "VALIDATION_ERROR",
      });
      return;
    }

    // Timeout
    if (error instanceof TimeoutError) {
      logger.error("timeout error at scrapeController: ", error);
      res.status(408).json({
        success: false,
        error: error.message,
        code: "TIMEOUT",
        url: error.url,
      });
      return;
    }

    // Scrape
    if (error instanceof ScrapeError) {
      logger.error("scrape error at scrapeController: ", error);
      const statusCode = error.statusCode ?? 500;
      res.status(statusCode).json({
        success: false,
        error: error.message,
        code: "SCRAPE_ERROR",
        url: error.url,
      });
      return;
    }

    // Unknown
    logger.error("unknown error at scrapeController: ", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      code: "INTERNAL_ERROR",
    });
  }
};
