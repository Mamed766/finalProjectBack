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
  getAllNews,
  getNewsById,
  createNews,
  deleteNews,
  updateNews,
} = require("../controllers/NewsController");

const { ErrorMiddleware } = require("../utils/ErrorHandler");

router.get("/", getAllNews);
router.get("/:id", getNewsById);
router.post("/", upload.fields([{ name: "image" }]), createNews);
router.put("/:id", upload.fields([{ name: "image" }]), updateNews);
router.delete("/:id", deleteNews);

router.use(ErrorMiddleware);

module.exports = router;
