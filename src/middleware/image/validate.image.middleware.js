import { fileTypeFromFile } from "file-type";
import fs from "fs";

export const validateImageContent = async (req, res, next) => {
  if (!req.file) return next();

  const type = await fileTypeFromFile(req.file.path);

  if (!type || !["image/png", "image/jpeg"].includes(type.mime)) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: "Invalid image content" });
  }

  next();
};
