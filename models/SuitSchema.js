const mongoose = require("mongoose");

const SuitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image1: {
    type: String,
    required: true,
  },
  image2: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  stock: {
    type: Number,
    required: true,
  },
  size: {
    type: [Number],
    enum: [4, 6, 8, 10],
    required: true,
  },
  color: {
    type: String,
    enum: ["pink", "purple", "red", "yellow"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Suit", SuitSchema);
