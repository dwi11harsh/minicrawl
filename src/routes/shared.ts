import { NextFunction, Request, Response } from "express";
import logger from "@/lib/logger";

export function wrap(
  controller: (req: Request, res: Response) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    controller(req, res).catch((err) => next(err));
  };
}

export function requestTimingMiddleware(version: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    // log after response is sent
    res.on("finish", () => {
      const duration = Date.now() - startTime;
      logger.info(`[${version}] ${req.method} ${req.path} - ${duration}ms`);
    });

    next();
  };
}
