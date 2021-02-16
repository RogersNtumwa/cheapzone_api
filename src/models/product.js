const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        uri: {
          type: String,
          required: true,
        },
      },
    ],
    ratings: { type: Number, default: 0 },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
    price: { type: Number, required: true },
    numOfReviews: { type: Number, default: 0 },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        comment: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
