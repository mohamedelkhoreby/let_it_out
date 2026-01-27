import multer from "multer";
import path from "path";
import fs from "fs";

export const localFileUpload = ({ customPath = "general" }) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      let basePath = `uploads/${customPath}`;

      if (req.user?._id) {
        basePath = path.join(basePath, req.user._id.toString());
      }

      const uploadPath = path.resolve(`./src/${basePath}`);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
    fileFilter: (req, file, cb) => {
      const allowedMime = ["image/png", "image/jpeg"];
      const ext = path.extname(file.originalname).toLowerCase();
      const allowedExt = [".png", ".jpg", ".jpeg"];

      if (!allowedMime.includes(file.mimetype) || !allowedExt.includes(ext)) {
        return cb(new Error("Only PNG/JPG images are allowed"), false);
      }

      cb(null, true);
    },
  });
  return multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
  }).single("avatar");
};
