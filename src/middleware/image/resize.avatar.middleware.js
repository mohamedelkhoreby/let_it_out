import sharp from "sharp";
import path from "path";
import fs from "fs";

export const resizeAvatar = async (req, res, next) => {
  if (!req.file) return next();

  const resizedPath = req.file.path.replace(
    path.extname(req.file.path),
    "-resized.webp"
  );

  await sharp(req.file.path)
    .resize(256, 256)
    .webp({ quality: 80 })
    .toFile(resizedPath);

  fs.unlinkSync(req.file.path);

  req.file.path = resizedPath;
  next();
};
