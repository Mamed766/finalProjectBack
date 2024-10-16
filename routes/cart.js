const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Cart = require("../models/Cart");
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

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) =>
      item.productId.equals(productId) &&
      item.size === size &&
      item.color === color
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
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
    cart.items.push(newItem);
  }

  try {
    const savedCart = await cart.save();
    res.status(200).json({ message: "Item added to cart", cart: savedCart });
  } catch (error) {
    res.status(500).json({ message: "Item not saved", error });
  }
});

router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (cart) {
      const cartItems = cart.items.map((item) => ({
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

      res.status(200).json({ items: cartItems });
    } else {
      res.status(200).json({ items: [] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occured" });
  }
});

router.delete("/remove", async (req, res) => {
  const { productId, size, color } = req.body;
  const userId = req.user._id;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.equals(productId) &&
          item.size === size &&
          item.color === color
        )
    );

    await cart.save();
    res.status(200).json({ message: "item deleted from cart", cart });
  } catch (error) {
    res.status(500).json({ message: "item dont deleted", error });
  }
});

module.exports = router;
