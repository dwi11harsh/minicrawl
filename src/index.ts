// main server entry point
import bodyParser from "body-parser";
import "dotenv/config";
import express, { Application, NextFunction, Request, Response } from "express";
import logger from "./lib/logger";
import v1router from "./routes/v1";

const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || "0.0.0.0";

const app: Application = express();
app.use(bodyParser.json());

app.use("/v1", v1router);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error("Global error handler: ", err);

  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

app.listen(PORT, () => {
  logger.info(`server running on port: ${PORT}`);
});
