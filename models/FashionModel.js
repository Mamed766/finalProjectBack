const mongoose = require("mongoose");

const FashionSchema = new mongoose.Schema({
  fashionImage: {
    type: String,
    required: true,
  },
  fashionImage2: {
    type: String,
    required: true,
  },
  fashionType: {
    type: String,
    required: true,
  },
  fashionType2: {
    type: String,
    required: true,
  },
  fashionWhom: {
    type: String,
    required: true,
  },
  fashionWhom2: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Fashion", FashionSchema);
