const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Wishlist = require("../models/Wishlist");
const Suit = require("../models/SuitSchema");

router.post("/add", async (req, res) => {
  const { productId, quantity, size, color } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "invalid item ID" });
  }

  const product = await Suit.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Item not found" });
  }

  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = new Wishlist({ userId, items: [] });
  }

  const itemIndex = wishlist.items.findIndex(
    (item) =>
      item.productId.equals(productId) &&
      item.size === size &&
      item.color === color
  );

  if (itemIndex > -1) {
    return res.status(400).json({ message: "Item already in wishlist" });
  } else {
    const newItem = {
      productId: new mongoose.Types.ObjectId(productId),
      quantity,
      title: product.title,
      image1: product.image1,
      image2: product.image2,
      price: product.price,
      rating: product.rating,
      stock: product.stock,
      size,
      color,
    };
    wishlist.items.push(newItem);
  }

  try {
    const savedWishlist = await wishlist.save();
    res
      .status(200)
      .json({ message: "Item added to wishlist", wishlist: savedWishlist });
  } catch (error) {
    res.status(500).json({ message: "Item not saved to wishlist", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ userId }).populate(
      "items.productId"
    );

    if (wishlist) {
      const wishlistItems = wishlist.items.map((item) => ({
        productId: item.productId._id,
        title: item.productId.title,
        image1: item.productId.image1,
        image2: item.productId.image2,
        price: item.productId.price,
        rating: item.productId.rating,
        stock: item.productId.stock,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      }));

      res.status(200).json({ items: wishlistItems });
    } else {
      res.status(200).json({ items: [] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred" });
  }
});

// Wishlistten ürün silme
router.delete("/remove", async (req, res) => {
  const { productId, size, color } = req.body;
  const userId = req.user._id;

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.items = wishlist.items.filter(
      (item) =>
        !(
          item.productId.equals(productId) &&
          item.size === size &&
          item.color === color
        )
    );

    await wishlist.save();
    res.status(200).json({ message: "Item removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Item not removed from wishlist", error });
  }
});

module.exports = router;
