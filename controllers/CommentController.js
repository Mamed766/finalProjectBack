const Comment = require("../models/CommentModel");
const { ErrorHandler } = require("../utils/ErrorHandler");

const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find();
    if (!comments.length) {
      return next(new ErrorHandler("No comments found", 404));
    }
    res.status(200).json({ success: true, comments });
  } catch (error) {
    next(error);
  }
};

const getCommentById = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(new ErrorHandler("Comment not found", 404));
    }
    res.status(200).json({ success: true, comment });
  } catch (error) {
    next(new ErrorHandler("Invalid comment ID", 400));
  }
};

const createComment = async (req, res) => {
  try {
    const { review, rating, email, username } = req.body;

    const newComment = await Comment.create({
      review,
      rating,
      email,
      username,
    });

    return res.status(201).json({
      success: true,
      newComment,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) {
      return next(new ErrorHandler("Comment not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(new ErrorHandler("Invalid comment ID", 400));
  }
};

const updateComment = async (req, res, next) => {
  try {
    const { review, rating, email, username } = req.body;

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return next(new ErrorHandler("Comment not found", 404));
    }

    const updatedData = {
      review: review || comment.review,
      rating: rating || comment.rating,
      email: email || comment.email,
      username: username || comment.username,
    };

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, updatedComment });
  } catch (error) {
    next(new ErrorHandler("Invalid comment ID", 400));
  }
};

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  deleteComment,
  updateComment,
};
