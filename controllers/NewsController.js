const News = require("../models/NewsModel");
const { ErrorHandler } = require("../utils/ErrorHandler");

const getAllNews = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const totalNews = await News.countDocuments();
    const totalPages = Math.ceil(totalNews / limitNumber);

    const news = await News.find()
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    if (!news.length) {
      return next(new ErrorHandler("No news found", 404));
    }

    res.status(200).json({
      success: true,
      news,
      pagination: {
        totalNews,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getNewsById = async (req, res, next) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) {
      return next(new ErrorHandler("News item not found", 404));
    }
    res.status(200).json({ success: true, newsItem });
  } catch (error) {
    next(new ErrorHandler("Invalid news item ID", 400));
  }
};

const createNews = async (req, res) => {
  try {
    const image = req.files && req.files.image ? req.files.image[0].path : null;
    const { title, date, desc1, desc2 } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const newNews = await News.create({
      image,
      title,
      date,
      desc1,
      desc2,
    });

    return res.status(201).json({
      success: true,
      newNews,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteNews = async (req, res, next) => {
  try {
    const newsItem = await News.findByIdAndDelete(req.params.id);
    if (!newsItem) {
      return next(new ErrorHandler("News item not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "News item deleted successfully",
    });
  } catch (error) {
    next(new ErrorHandler("Invalid news item ID", 400));
  }
};

const updateNews = async (req, res, next) => {
  try {
    const image = req.files && req.files.image ? req.files.image[0].path : null;
    const { title, date, desc1, desc2 } = req.body;

    const newsItem = await News.findById(req.params.id);

    if (!newsItem) {
      return next(new ErrorHandler("News item not found", 404));
    }

    const updatedData = {
      image: image || newsItem.image,
      title: title || newsItem.title,
      date: date || newsItem.date,
      desc1: desc1 || newsItem.desc1,
      desc2: desc2 || newsItem.desc2,
    };

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, updatedNews });
  } catch (error) {
    next(new ErrorHandler("Invalid news item ID", 400));
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  deleteNews,
  updateNews,
};
