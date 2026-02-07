import AppError from "../../utils/app_error.js";
export function corsOptions() {
  const whitelist = process.env.WHITELIST.split(",");

  const coreOptions = {
    origin: function (origin, callback) {
      if (whitelist.includes(origin)) {
        callback(null, true);
      } else if (!origin) {
        callback(null, true);
      } else {
      callback(new AppError("Not allowed by CORS"));
    }
  },};
  return coreOptions;
};
