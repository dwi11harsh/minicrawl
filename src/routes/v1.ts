import express from "express";
import { scrapeController } from "../controllers/v1/scrape";

const v1router = express.Router();

v1router.get("/ping", (req, res) => {
  res.send({ message: "v1 is alive" });
});

v1router.post("/scrape", scrapeController);

export default v1router;
