const mongoose = require("mongoose");

const categoryschema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categoryschema);

module.exports = Category;
