import express from "express";
import { crawlController } from "../controllers/v1/crawl";
import { crawlStatusController } from "../controllers/v1/crawl-status";
import { scrapeController } from "../controllers/v1/scrape";
import { wrap } from "./shared";

const v1router = express.Router();

v1router.get("/ping", (req, res) => {
  res.send({ message: "v1 is alive" });
});

v1router.post("/scrape", wrap(scrapeController));

v1router.post("/crawl", wrap(crawlController));

v1router.get("/crawl/:jobId", wrap(crawlStatusController));

export default v1router;
