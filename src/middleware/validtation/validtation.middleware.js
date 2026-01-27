export const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];

    ["body", "params", "query"].forEach((key) => {
      if (schema[key]) {
        const { error, value } = schema[key].validate(req[key], {
          abortEarly: false,
          stripUnknown: true,
        });

        if (error) {
          errors.push(...error.details.map((d) => d.message));
        } else {
          req[key] = { ...req[key], ...value };
        }
      }
    });

    if (errors.length) {
      return res.status(400).json({
        message: "Validation error",
        errors,
      });
    }

    next();
  };
};
