import multer from "multer";

import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/receipts");
  },

  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}-${Math.random()}${path.extname(file.originalname)}`,
    );
  },
});

export const upload = multer({
  storage,
});
