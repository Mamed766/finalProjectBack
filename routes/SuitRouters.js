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
  getAllSuits,
  getSuitById,
  createSuit,
  deleteSuit,
  updateSuit,
} = require("../controllers/Suitproductcontroller");

const { ErrorMiddleware } = require("../utils/ErrorHandler");

router.get("/", getAllSuits);
router.get("/:id", getSuitById);
router.post(
  "/",
  upload.fields([{ name: "image1" }, { name: "image2" }]),
  createSuit
);
router.put(
  "/:id",
  upload.fields([{ name: "image1" }, { name: "image2" }]),
  updateSuit
);
router.delete("/:id", deleteSuit);

router.use(ErrorMiddleware);

module.exports = router;
