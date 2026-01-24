import appRouter from "./routes/app.routes.js";
import { globalErrorHandler } from "./middleware/errorHandler.middleware.js";

export const bootstrap = (app, express) => {
  app.use(express.json());
  
  appRouter(app);

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });
  app.use(globalErrorHandler);

};

export default bootstrap;
