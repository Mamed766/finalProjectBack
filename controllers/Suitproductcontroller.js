const Suit = require("../models/SuitSchema");
const { ErrorHandler } = require("../utils/ErrorHandler");

const getAllSuits = async (req, res, next) => {
  try {
    const suits = await Suit.find();
    if (!suits.length) {
      return next(new ErrorHandler("No suits found", 404));
    }
    res.status(200).json({ success: true, suits });
  } catch (error) {
    next(error);
  }
};

const getSuitById = async (req, res, next) => {
  try {
    const suit = await Suit.findById(req.params.id);
    if (!suit) {
      return next(new ErrorHandler("Suit item not found", 404));
    }
    res.status(200).json({ success: true, suit });
  } catch (error) {
    next(new ErrorHandler("Invalid suit item ID", 400));
  }
};

const createSuit = async (req, res) => {
  try {
    const image1 =
      req.files && req.files.image1 ? req.files.image1[0].path : null;
    const image2 =
      req.files && req.files.image2 ? req.files.image2[0].path : null;
    const { title, price, rating, stock, size, color } = req.body;

    if (!image1 || !image2) {
      return res.status(400).json({
        success: false,
        message: "Both image1 and image2 are required",
      });
    }

    const newSuit = await Suit.create({
      title,
      image1,
      image2,
      price,
      rating,
      stock,
      size,
      color,
    });

    return res.status(201).json({
      success: true,
      newSuit,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteSuit = async (req, res, next) => {
  try {
    const suit = await Suit.findByIdAndDelete(req.params.id);
    if (!suit) {
      return next(new ErrorHandler("Suit item not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Suit item deleted successfully",
    });
  } catch (error) {
    next(new ErrorHandler("Invalid suit item ID", 400));
  }
};

const updateSuit = async (req, res, next) => {
  try {
    const image1 =
      req.files && req.files.image1 ? req.files.image1[0].path : null;
    const image2 =
      req.files && req.files.image2 ? req.files.image2[0].path : null;
    const { title, price, rating, stock, size, color } = req.body;

    const suit = await Suit.findById(req.params.id);

    if (!suit) {
      return next(new ErrorHandler("Suit item not found", 404));
    }

    const updatedData = {
      image1: image1 || suit.image1,
      image2: image2 || suit.image2,
      title: title || suit.title,
      price: price || suit.price,
      rating: rating || suit.rating,
      stock: stock || suit.stock,
      size: size || suit.size,
      color: color || suit.color,
    };

    const updatedSuit = await Suit.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, updatedSuit });
  } catch (error) {
    next(new ErrorHandler("Invalid suit item ID", 400));
  }
};

module.exports = {
  getAllSuits,
  getSuitById,
  createSuit,
  deleteSuit,
  updateSuit,
};
