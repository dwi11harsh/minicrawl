import express from "express";
import { crawlController } from "../controllers/v1/crawl";
import { scrapeController } from "../controllers/v1/scrape";
import { wrap } from "./shared";

const v1router = express.Router();

v1router.get("/ping", (req, res) => {
  res.send({ message: "v1 is alive" });
});

v1router.post("/scrape", wrap(scrapeController));

v1router.post("/crawl", wrap(crawlController));

export default v1router;
