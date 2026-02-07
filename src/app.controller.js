import appRouter from "./routes/app.routes.js";
import { globalErrorHandler } from "./middleware/errorHandler.middleware.js";
import cors from "cors";
import { corsOptions } from "./utils/cors/cors.js";
export const bootstrap = (app, express) => {
  app.use(express.json());
  app.use(cors(corsOptions()));

  appRouter(app);

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });
  // error come from middleware
  app.use(globalErrorHandler);
};

export default bootstrap;
