const Fashion = require("../models/FashionModel");
const { ErrorHandler } = require("../utils/ErrorHandler");

const getAllFashions = async (req, res, next) => {
  try {
    const fashions = await Fashion.find();
    if (!fashions.length) {
      return next(new ErrorHandler("No fashions found", 404));
    }
    res.status(200).json({ success: true, fashions });
  } catch (error) {
    next(error);
  }
};

const getFashionById = async (req, res, next) => {
  try {
    const fashion = await Fashion.findById(req.params.id);
    if (!fashion) {
      return next(new ErrorHandler("Fashion item not found", 404));
    }
    res.status(200).json({ success: true, fashion });
  } catch (error) {
    next(new ErrorHandler("Invalid fashion item ID", 400));
  }
};

const createFashion = async (req, res) => {
  try {
    const fashionImage =
      req.files && req.files.fashionImage
        ? req.files.fashionImage[0].path
        : null;
    const fashionImage2 =
      req.files && req.files.fashionImage2
        ? req.files.fashionImage2[0].path
        : null;
    const { fashionType, fashionWhom, fashionType2, fashionWhom2 } = req.body;

    if (!fashionImage || !fashionImage2) {
      return res.status(400).json({
        success: false,
        message: "Both fashionImage and fashionImage2 are required",
      });
    }

    const newFashion = await Fashion.create({
      fashionImage,
      fashionImage2,
      fashionType,
      fashionType2,
      fashionWhom,
      fashionWhom2,
    });

    return res.status(201).json({
      success: true,
      newFashion,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deleteFashion = async (req, res, next) => {
  try {
    const fashion = await Fashion.findByIdAndDelete(req.params.id);
    if (!fashion) {
      return next(new ErrorHandler("Fashion item not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Fashion item deleted successfully",
    });
  } catch (error) {
    next(new ErrorHandler("Invalid fashion item ID", 400));
  }
};

const updateFashion = async (req, res, next) => {
  try {
    const fashionImage =
      req.files && req.files.fashionImage
        ? req.files.fashionImage[0].path
        : null;
    const fashionImage2 =
      req.files && req.files.fashionImage2
        ? req.files.fashionImage2[0].path
        : null;
    const { fashionType, fashionWhom, fashionWhom2, fashionType2 } = req.body;

    const fashion = await Fashion.findById(req.params.id);

    if (!fashion) {
      return next(new ErrorHandler("Fashion item not found", 404));
    }

    const updatedData = {
      fashionImage: fashionImage || fashion.fashionImage,
      fashionImage2: fashionImage2 || fashion.fashionImage2,
      fashionType: fashionType || fashion.fashionType,
      fashionWhom: fashionWhom || fashion.fashionWhom,
      fashionType2: fashionType2 || fashion.fashionType2,
      fashionWhom2: fashionWhom2 || fashion.fashionWhom2,
    };

    const updatedFashion = await Fashion.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, updatedFashion });
  } catch (error) {
    next(new ErrorHandler("Invalid fashion item ID", 400));
  }
};

module.exports = {
  getAllFashions,
  getFashionById,
  createFashion,
  deleteFashion,
  updateFashion,
};
