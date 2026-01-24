import userRoutes from "./user.routes.js";

const appRouter = (app) => {
  app.use("/users", userRoutes);
};

export default appRouter;