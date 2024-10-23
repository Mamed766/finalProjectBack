const express = require("express");
const router = express.Router();

const {
  getAllComments,
  getCommentById,
  createComment,
  deleteComment,
  updateComment,
} = require("../controllers/CommentController");

const { ErrorMiddleware } = require("../utils/ErrorHandler");

router.get("/", getAllComments);
router.get("/:id", getCommentById);
router.post("/", createComment);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);

router.use(ErrorMiddleware);

module.exports = router;
