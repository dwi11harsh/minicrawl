import express from "express";
import { crawlController } from "../controllers/v1/crawl";
import { scrapeController } from "../controllers/v1/scrape";

const v1router = express.Router();

v1router.get("/ping", (req, res) => {
  res.send({ message: "v1 is alive" });
});

v1router.post("/scrape", scrapeController);

v1router.post("/crawl", crawlController);

export default v1router;
