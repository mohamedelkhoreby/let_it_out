import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import connectDB from "./src/config/db.config.js";
import logger from "./src/utils/logger.js";
import bootstrap from "./src/app.controller.js";

const app = express();
const PORT = process.env.PORT || 3000;

try {
  await connectDB();
  logger.info("Database connected successfully");
} catch (err) {
  logger.error("Failed to connect database", err);
  process.exit(1);
}
``;

bootstrap(app, express);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  logger.info("Duck running 🦆");
});
