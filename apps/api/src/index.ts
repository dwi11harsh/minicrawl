import { log } from "@repo/logger";
import { config } from "dotenv";
import path from "path";
import { createServer } from "./server";

config({ path: path.resolve(__dirname, "../../../.env.local") });

const port = process.env.API_PORT || 5001;
console.log("server port is : ", port);
const server = createServer();

server.listen(port, () => {
  log(`api running on ${port}`);
});
