// main server entry point
import bodyParser from "body-parser";
import express, { Application } from "express";
import v1router from "./routes/v1";

const router = express.Router();

const port = process.env.PORT || 3002;

const app: Application = express();
app.use(bodyParser.json());

app.use("/v1", v1router);

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
