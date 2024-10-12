const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const {
  getAllFashions,
  getFashionById,
  createFashion,
  deleteFashion,
  updateFashion,
} = require("../controllers/FashionController");

const { ErrorMiddleware } = require("../utils/ErrorHandler");

router.get("/", getAllFashions);
router.get("/:id", getFashionById);
router.post(
  "/",
  upload.fields([{ name: "fashionImage" }, { name: "fashionImage2" }]),
  createFashion
);
router.put(
  "/:id",
  upload.fields([{ name: "fashionImage" }, { name: "fashionImage2" }]),
  updateFashion
);
router.delete("/:id", deleteFashion);

router.use(ErrorMiddleware);

module.exports = router;
