const Suit = require("../models/SuitSchema");
const { ErrorHandler } = require("../utils/ErrorHandler");

const getAllSuits = async (req, res, next) => {
  const {
    color,
    size,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
    status,
    search,
  } = req.query;

  const filter = {};

  if (color) {
    const colorsArray = color.split(",").filter((c) => c.trim() !== "");
    if (colorsArray.length > 0) {
      filter.color = { $in: colorsArray };
    }
  }

  if (size) {
    filter.size = size;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) {
      filter.price.$gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      filter.price.$lte = parseFloat(maxPrice);
    }
  }

  if (search && search.trim() !== "") {
    const searchRegex = new RegExp(search, "i");
    filter.$or = [{ title: searchRegex }, { desc: searchRegex }];
  }

  if (status) {
    filter.status = status;
  }

  try {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const totalSuits = await Suit.countDocuments(filter);
    const totalPages = Math.ceil(totalSuits / limitNumber);

    const suits = await Suit.find(filter)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.status(200).json({
      success: true,
      suits,
      pagination: {
        totalSuits,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
      },
    });
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
    const { title, price, rating, stock, size, color, desc, status } = req.body;

    if (!image1 || !image2) {
      return res.status(400).json({
        success: false,
        message: "Both image1 and image2 are required",
      });
    }

    const newSuit = await Suit.create({
      title,
      desc,
      image1,
      image2,
      price: parseFloat(price),
      rating: parseFloat(rating),
      stock: parseInt(stock),
      size,
      color,
      status: status || "pending",
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
    const { title, price, rating, stock, size, color, desc, status } = req.body;

    const suit = await Suit.findById(req.params.id);

    if (!suit) {
      return next(new ErrorHandler("Suit item not found", 404));
    }

    const updatedData = {
      image1: image1 || suit.image1,
      image2: image2 || suit.image2,
      title: title || suit.title,
      price: price ? parseFloat(price) : suit.price,
      rating: rating ? parseFloat(rating) : suit.rating,
      stock: stock ? parseInt(stock) : suit.stock,
      size: size || suit.size,
      color: color || suit.color,
      desc: desc || suit.desc,
      status: status || suit.status,
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
